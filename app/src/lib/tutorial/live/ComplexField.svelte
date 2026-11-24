<script lang="ts">
	/**
	 * Chapter 6.6's complex field at one point. The fields E and cB that a sensor reads, drawn in the light role's
	 * colour (E solid, cB dashed) in three linked views along the sensor's x, y and z axes, beside a small sky with
	 * light's two principal null directions, the roots of m(z)·F = 0. The sensor is boosted by a rapidity η along x,
	 * y, z or E × B of the field at rest, and its axes are then turned about an axis; readouts give the complex
	 * components of F = E + icB, the invariants E² − c²B² and cE·B, and the Hermitian length E² + c²B². A second
	 * mode shows a circularly polarized plane wave F = a m along z, with a's point in the complex plane. Three
	 * predictions are answered once the reader has done what each asks. All the arithmetic is in ./complex-field.ts.
	 * The wave turns only when asked to, and never under reduced motion.
	 */
	import { MediaQuery } from 'svelte/reactivity';
	import type { Attachment } from 'svelte/attachments';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		ArrowDiagonalIcon,
		ArrowRight01Icon,
		ArrowUp01Icon,
		DashboardSpeed02Icon,
		Navigation03Icon,
		PauseIcon,
		PlayIcon,
		RefreshIcon,
		Rotate01Icon,
		Target02Icon,
		WaveIcon,
		ZapIcon
	} from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Segmented from '../../ui/controls/Segmented.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import {
		CHARGE,
		LN2,
		OPENING,
		RAPIDITY,
		TURN,
		acrossFound,
		amplitude,
		boostAxis,
		cabs,
		complexOf,
		complexTex,
		complexWords,
		dot,
		etaWords,
		hermitian,
		invariants,
		keyed,
		landed,
		norm,
		parallelFound,
		principalDirections,
		reading,
		restField,
		speed,
		three,
		twentieth,
		vecTex,
		vecWords,
		velocity,
		waveAmplitude,
		waveFound,
		withComponent,
		type Axis,
		type C,
		type Direction,
		type Field,
		type Mode,
		type Setup,
		type V3
	} from './complex-field';

	const uid = $props.id();

	// --- the settings ---------------------------------------------------------------------------------------------
	let mode = $state<Mode>(OPENING.mode);
	let rest = $state<Field>(OPENING.rest);
	let phase = $state(OPENING.phase);
	let direction = $state<Direction>(OPENING.direction);
	let eta = $state(OPENING.eta);
	let turnAxis = $state<Axis>(OPENING.turnAxis);
	let turn = $state(OPENING.turn);

	const setup = $derived<Setup>({ mode, rest, phase, direction, eta, turnAxis, turn });

	function setMode(v: Mode) {
		mode = v;
		if (v === 'static') playing = false;
		note();
	}

	function setEta(v: number) {
		const next = landed(v);
		if (next === eta) return;
		eta = next;
		note();
	}

	function setDirection(v: Direction) {
		direction = v;
		note();
	}

	function setTurn(v: number) {
		const next = Math.max(TURN.min, Math.min(TURN.max, Math.round(v / TURN.step) * TURN.step));
		if (next === turn) return;
		turn = next;
		note();
	}

	function setTurnAxis(v: Axis) {
		turnAxis = v;
		note();
	}

	function setComponent(which: 'E' | 'B', i: number, v: number) {
		rest = withComponent(rest, which, i, twentieth(v));
		note();
	}

	/** Back to the opening: the charge's field, read by a sensor at rest. */
	function toCharge() {
		rest = CHARGE;
		eta = 0;
		turn = 0;
		note();
	}

	/** The sensor's reading becomes the field at rest, so that a second boost starts from it. */
	function startHere() {
		const f = reading(setup);
		const clean = (v: V3): V3 => v.map((c) => (Math.abs(c) < 1e-12 ? 0 : c)) as V3;
		rest = { E: clean(f.E), B: clean(f.B) };
		eta = 0;
		turn = 0;
		note();
	}

	/** The arrow keys step the rapidity by 0.05, and Page Up and Page Down by 0.5, landing on the named values. */
	function rapidityKeys(e: KeyboardEvent) {
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
		setEta(keyed(eta, Math.sign(d), Math.abs(d) * RAPIDITY.key));
	}

	// --- the wave's time ------------------------------------------------------------------------------------------
	const reduced = new MediaQuery('(prefers-reduced-motion: reduce)', false);
	let playing = $state(false);

	/** The wave's clock, attached to the views: it runs only while the wave is let pass. */
	const clock: Attachment = () => {
		if (!playing || reduced.current || mode !== 'wave') return;
		let raf = 0;
		let last: number | undefined;
		const tick = (t: number) => {
			const dt = last === undefined ? 0 : Math.min(0.1, (t - last) / 1000);
			last = t;
			// one turn of a every six seconds
			phase = (phase + dt * 60) % 360;
			note();
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	};

	// --- the predictions --------------------------------------------------------------------------------------------
	let step = $state<1 | 2>(1);
	let found1 = $state<ReturnType<typeof acrossFound>>();
	let found2 = $state<ReturnType<typeof parallelFound>>();
	let found3 = $state<ReturnType<typeof waveFound>>();

	function note() {
		found1 ??= acrossFound(setup);
		found2 ??= parallelFound(setup);
		found3 ??= waveFound(setup);
	}

	const revealed = $derived(
		mode === 'wave'
			? found3 !== undefined
			: step === 1
				? found1 !== undefined
				: found2 !== undefined
	);

	// --- the numbers ------------------------------------------------------------------------------------------------
	const ETA = '\\htmlClass{q-obs}{\\eta}';
	const BETA = '\\htmlClass{q-obs}{\\beta}';
	const GAMMA = '\\htmlClass{q-obs}{\\gamma}';
	const VE = '\\htmlClass{q-light}{\\boldsymbol{E}}';
	const VB = 'c\\htmlClass{q-light}{\\boldsymbol{B}}';
	const VF = '\\htmlClass{q-light}{\\boldsymbol{F}}';
	const VBB = '\\htmlClass{q-light}{\\boldsymbol{B}}';
	const LE = '\\htmlClass{q-light}{E}';
	const LB = '\\htmlClass{q-light}{B}';
	const LA = '\\htmlClass{q-light}{a}';

	const sp = $derived(speed(eta));
	const axis = $derived(boostAxis(setup));
	const atRest = $derived(restField(setup));
	const f = $derived(reading(setup));
	const F = $derived(complexOf(f));
	const inv = $derived(invariants(f));
	const inv0 = $derived(invariants(atRest));
	const herm = $derived(hermitian(f));
	const herm0 = $derived(hermitian(atRest));
	const v = $derived(velocity(setup));
	const pnd = $derived(principalDirections(f));
	const a0 = $derived(waveAmplitude(phase));
	const a1 = $derived(mode === 'wave' ? amplitude(f) : undefined);

	const AXIS_NAMES: Record<Axis, string> = { x: 'x', y: 'y', z: 'z' };
	const directionWords = $derived(
		direction === 'flow'
			? axis.fallback
				? 'z (E × B is zero here)'
				: `E × B, û = ${vecWords(axis.u)}`
			: AXIS_NAMES[direction]
	);

	/** A rapidity in LaTeX, "\\ln 2 = 0.693" or "\\tfrac12\\ln 3 = 0.549" or the value. */
	const etaTex = (x: number) =>
		etaWords(x)
			.replace(/−/g, '-')
			.replace(/½ ln 3/, '\\tfrac12\\ln 3')
			.replace(/(^|-)ln (\d)/, '$1\\ln $2');

	/** A small number shown as 0 to three figures. */
	const n3 = (x: number) => three(Math.abs(x) < 5e-10 ? 0 : x);
	const vec3 = (q: V3) => `(${q.map(n3).join(', ')})`;
	const cplx = (z: C) => complexWords({ re: clean(z.re), im: clean(z.im) });
	const clean = (x: number) => (Math.abs(x) < 5e-10 ? 0 : x);

	// --- the drawing ------------------------------------------------------------------------------------------------
	const W = 150;
	const O = 75;
	const R = 58;
	/** Drawing units in one CSS pixel, shared by the panels, which are all one size. */
	let u = $state(1);
	const f2 = (n: number) => n.toFixed(2);

	type Pt = { x: number; y: number };
	/** The three views, each with its axis toward the reader: x shows (y, z), y shows (z, x), z shows (x, y). */
	const VIEWS: { axis: Axis; right: 0 | 1 | 2; up: 0 | 1 | 2; toward: 0 | 1 | 2 }[] = [
		{ axis: 'x', right: 1, up: 2, toward: 0 },
		{ axis: 'y', right: 2, up: 0, toward: 1 },
		{ axis: 'z', right: 0, up: 1, toward: 2 }
	];
	const LETTER = ['x', 'y', 'z'];

	/** The scale of the three views: a field of 1.9 fills them, and larger ones are drawn smaller. */
	const span = $derived(Math.max(1.9, 1.45 * Math.max(norm(f.E), norm(f.B), norm(v))));
	const k = $derived(R / span);

	type Drawn =
		| { kind: 'line'; shaft: string; head: string; tip: Pt; dir: Pt }
		| { kind: 'point'; toward: boolean }
		| undefined;

	/** An arrow from the centre of a view: a line with a head, or a ring at the centre when it points at the reader. */
	function drawArrow(q: V3, view: (typeof VIEWS)[number], head = 8): Drawn {
		const full = norm(q);
		if (full < 1e-9) return undefined;
		const px = q[view.right] * k;
		const py = q[view.up] * k;
		const len = Math.hypot(px, py);
		if (len < 3.5 * u) return { kind: 'point', toward: q[view.toward] > 0 };
		const d = { x: px / len, y: -py / len };
		const n = { x: -d.y, y: d.x };
		const tip = { x: O + px, y: O - py };
		const l = Math.min(head * u, len * 0.6);
		const w = 0.42 * l;
		const base = { x: tip.x - d.x * l, y: tip.y - d.y * l };
		const end = { x: tip.x - d.x * l * 0.7, y: tip.y - d.y * l * 0.7 };
		return {
			kind: 'line',
			shaft: `M${O},${O}L${f2(end.x)},${f2(end.y)}`,
			head: `M${f2(tip.x)},${f2(tip.y)}L${f2(base.x + n.x * w)},${f2(base.y + n.y * w)}L${f2(base.x - n.x * w)},${f2(base.y - n.y * w)}Z`,
			tip,
			dir: d
		};
	}

	const inside = (x: number) => Math.max(8 * u, Math.min(W - 8 * u, x));

	/** Where an arrow's name goes: past its tip, or beside its ring; nudged off another name. */
	function labelAt(a: Drawn, ring: number, other?: Pt): Pt | undefined {
		if (!a) return undefined;
		let p =
			a.kind === 'line'
				? { x: a.tip.x + a.dir.x * 11 * u, y: a.tip.y + a.dir.y * 11 * u + 4 * u }
				: { x: O + ring + 7 * u, y: O - ring - 2 * u };
		if (other && Math.hypot(p.x - other.x, p.y - other.y) < 12 * u) {
			const n = a.kind === 'line' ? { x: -a.dir.y, y: a.dir.x } : { x: 0, y: 1 };
			p = { x: p.x + n.x * 12 * u, y: p.y + n.y * 12 * u };
		}
		return { x: inside(p.x), y: Math.max(10 * u, Math.min(W - 4 * u, p.y)) };
	}

	const panels = $derived(
		VIEWS.map((view) => {
			const E = drawArrow(f.E, view);
			const B = drawArrow(f.B, view);
			const V = eta !== 0 ? drawArrow(v, view, 6) : undefined;
			const eAt = labelAt(E, 6 * u);
			const bAt = labelAt(B, 10 * u, eAt);
			const vAt = labelAt(V, 14 * u, bAt ?? eAt);
			// the tick's "1" under the axis, unless a name is there
			const at = { x: O + k, y: O + 9 * u };
			const oneLabel = [eAt, bAt, vAt].every(
				(p) => !p || Math.abs(p.x - at.x) > 12 * u || Math.abs(p.y - 4 * u - at.y) > 10 * u
			);
			return { view, E, B, V, eAt, bAt, vAt, oneLabel };
		})
	);
	/** The ticks at 1 on each view's axes, when they fall inside. */
	const one = $derived(k <= R ? k : undefined);

	// the sky: the sphere seen from outside, from a little to the right of −y and a little above
	const SKY_R = 56;
	const az = (25 * Math.PI) / 180;
	const el = (20 * Math.PI) / 180;
	const toward: V3 = [Math.sin(az) * Math.cos(el), -Math.cos(az) * Math.cos(el), Math.sin(el)];
	const right: V3 = [Math.cos(az), Math.sin(az), 0];
	const upward: V3 = [
		toward[1] * right[2] - toward[2] * right[1],
		toward[2] * right[0] - toward[0] * right[2],
		toward[0] * right[1] - toward[1] * right[0]
	];
	const sky = (n: V3): Pt & { front: boolean } => ({
		x: O + SKY_R * dot(n, right),
		y: O - SKY_R * dot(n, upward),
		front: dot(n, toward) >= -1e-9
	});

	/** A great circle as its front and back halves. */
	function circle(at: (t: number) => V3) {
		let front = '';
		let back = '';
		let was: boolean | undefined;
		for (let j = 0; j <= 120; j++) {
			const p = sky(at((2 * Math.PI * j) / 120));
			const cmd = was === p.front ? 'L' : 'M';
			if (p.front) {
				front += `${was === true ? cmd : 'M'}${f2(p.x)},${f2(p.y)}`;
			} else {
				back += `${was === false ? cmd : 'M'}${f2(p.x)},${f2(p.y)}`;
			}
			was = p.front;
		}
		return { front, back };
	}
	const equator = circle((t) => [Math.cos(t), Math.sin(t), 0]);
	const meridian = circle((t) => [Math.cos(t), 0, Math.sin(t)]);
	const skyAxes = (['x', 'y', 'z'] as const).map((name, i) => {
		const n: V3 = [0, 0, 0];
		n[i] = 1;
		const p = sky(n);
		const label = sky([n[0] * 1.17, n[1] * 1.17, n[2] * 1.17]);
		return { name, p, label };
	});
	const dirs = $derived(
		pnd ? pnd.dirs.map((d) => ({ ...sky(d.n), n: d.n, z: d.z, double: pnd.double })) : []
	);

	// the complex plane of a
	const aSpan = $derived(Math.max(1.75, 1.2 * Math.max(cabs(a0), a1 ? cabs(a1.a) : 0)));
	const ak = $derived(R / aSpan);
	const aPt = (z: C): Pt => ({ x: O + z.re * ak, y: O - z.im * ak });
	const aSame = $derived(
		a1 ? cabs({ re: a1.a.re - a0.re, im: a1.a.im - a0.im }) * ak < 6 * u : true
	);

	// --- the words --------------------------------------------------------------------------------------------------
	const pndWords = $derived(
		!pnd
			? 'There is no field, and so no special direction.'
			: pnd.double
				? `Light's two special directions coincide, along ${vec3(pnd.dirs[0].n)}: the field is null.`
				: `Light's two special directions point along ${vec3(pnd.dirs[0].n)} and ${vec3(pnd.dirs[1].n)}.`
	);

	const description = $derived(
		`The fields the sensor reads, drawn in three views along its x, y and z axes, each with that axis toward you: ` +
			`E = ${vec3(f.E)} and cB = ${vec3(f.B)}.` +
			(eta !== 0
				? ` The sensor moves at ${n3(sp.beta)} of the speed of light along ${directionWords}.`
				: ' The sensor is at rest.') +
			(turn !== 0 ? ` Its axes are turned by ${turn} degrees about ${turnAxis}.` : '') +
			` ${pndWords}` +
			(a1
				? ` In the complex plane the wave's amplitude is a′ = ${cplx(a1.a)}, against a = ${cplx(a0)} at rest.`
				: '')
	);

	const MODES: { value: Mode; label: string; icon: typeof ZapIcon }[] = [
		{ value: 'static', label: 'Static field', icon: ZapIcon },
		{ value: 'wave', label: 'Plane wave', icon: WaveIcon }
	];
	const DIRECTIONS: { value: Direction; label: string; icon: typeof ZapIcon }[] = [
		{ value: 'x', label: 'Along x', icon: ArrowRight01Icon },
		{ value: 'y', label: 'Along y', icon: ArrowUp01Icon },
		{ value: 'z', label: 'Along z', icon: ArrowDiagonalIcon },
		{ value: 'flow', label: 'Along E × B', icon: Navigation03Icon }
	];
	const TURN_AXES: { value: Axis; label: string; icon: typeof ZapIcon }[] = [
		{ value: 'x', label: 'About x', icon: Rotate01Icon },
		{ value: 'y', label: 'About y', icon: Rotate01Icon },
		{ value: 'z', label: 'About z', icon: Rotate01Icon }
	];
	const COMPONENTS = [0, 1, 2] as const;
</script>

{#snippet eq(parts: string[])}<span class="eq"
		>{#each parts as part, i (i)}<Tex
				math={i && part.startsWith('=') ? `{}${part}` : part}
				trust
			/>{/each}</span
	>{/snippet}

{#snippet arrowName(which: 'E' | 'B' | 'v', at: Pt | undefined)}
	{#if at}
		<text class={['name halo mid', which === 'v' ? 'obs-words' : 'light-words']} x={at.x} y={at.y}
			>{#if which === 'E'}<tspan class="bold">E</tspan>{:else if which === 'B'}<tspan class="it"
					>c</tspan
				><tspan class="bold">B</tspan>{:else}<tspan class="bold">v</tspan>{/if}</text
		>
	{/if}
{/snippet}

<div class="complex-field">
	<section class="predict" aria-labelledby="{uid}-predict">
		{#if mode === 'static'}
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
					Boost the sensor across the field at 0.6c. Which numbers change, and which stay?
				{:else}
					Set <Tex math={`${VE} = (1, 0, 0)`} trust /> and <Tex
						math={`${VB} = (0, \\tfrac12, 0)`}
						trust
					/>, and find the boost that makes <Tex math={VE} trust /> parallel to <Tex
						math={VBB}
						trust
					/>.
				{/if}
			</p>
			<p class={['answer', { shown: revealed }]} aria-live="polite">
				{#if revealed && step === 1 && found1}
					<strong>The components change; the two invariants stay.</strong> Boosted along
					<Tex math="z" /> at <Tex math={`${ETA} = \\ln 2`} trust />, the sensor reads <Tex
						math={`${LE}'_x = 1.25\\,${LE}`}
						trust
					/> and a magnetic field <Tex math={`c${LB}'_y = -0.75\\,${LE}`} trust /> that was not there
					at rest, because <Tex math="\cosh(\ln 2) = 1.25" /> and <Tex
						math="\sinh(\ln 2) = 0.75"
					/>. The Hermitian length <Tex math={`${LE}^2 + c^2${LB}^2`} trust /> grows from 1 to 2.125,
					while
					<Tex math={`${LE}^2 - c^2${LB}^2`} trust /> stays at 1 and <Tex
						math={`${VE}\\cdot ${VBB}`}
						trust
					/> at 0. Your boost, along {found1.u[0] ? 'x' : found1.u[1] ? 'y' : 'z'} at <Tex
						math={`${ETA} = ${found1.eta < 0 ? '-' : ''}\\ln 2`}
						trust
					/>, read <Tex math={`${VE}' = ${vecTex(found1.reading.E)}`} trust /> and <Tex
						math={`${VB}' = ${vecTex(found1.reading.B)}`}
						trust
					/>: the magnetic field lies across both the motion and <Tex math={VE} trust />.
					<button type="button" class="next" onclick={() => (step = 2)}>Next prediction</button>
				{:else if revealed && found2}
					<strong
						><Tex math={`${BETA} = \\tfrac12`} trust /> along <Tex math="z" />, the direction of <Tex
							math={`${VE}\\times ${VBB}`}
							trust
						/>.</strong
					>
					Split along <Tex math="\boldsymbol m" /> and <Tex math="\boldsymbol m^*" />, the field has
					<Tex math="f = 1.5/\sqrt2" /> and <Tex math="g = 0.5/\sqrt2" />, so <Tex
						math={`e^{2${ETA}} = |f|/|g| = 3`}
						trust
					/> and <Tex math={`${BETA} = (3 - 1)/(3 + 1) = \\tfrac12`} trust />. The sensor then reads
					<Tex math={`${VE}' = (0.866, 0, 0)`} trust /> and no magnetic field, with the square <Tex
						math="\tfrac34"
					/> that the invariant <Tex math="1 - \tfrac14" /> requires. You found <Tex
						math={`${BETA} = ${three(found2.beta).replace('−', '-')}`}
						trust
					/>, where the sensor read <Tex math={`${VE}' = ${vecTex(found2.reading.E)}`} trust /> and <Tex
						math={`${VB}' = ${vecTex(found2.reading.B)}`}
						trust
					/>. Now press <em>Start from this sensor</em> and boost along <Tex math="x" />, the common
					axis: nothing changes.
				{:else if step === 1}
					The answer appears once you have boosted the sensor, at rest in the charge’s field and
					with its axes not turned, at 0.6c (<Tex math={`${ETA} = \\pm\\ln 2`} trust />) along <Tex
						math="y"
					/> or <Tex math="z" />, across the field.
				{:else}
					The answer appears once you have set the field at rest to these values and boosted the
					sensor until the two fields it reads lie along one line.
				{/if}
			</p>
		{:else}
			<div class="steps">
				<span class="tag" id="{uid}-predict">Predict</span>
			</div>
			<p class="question">
				Run with the wave at 0.6c. What happens to <Tex math={LA} trust />?
			</p>
			<p class={['answer', { shown: revealed }]} aria-live="polite">
				{#if revealed && found3}
					<strong>It halves.</strong> Running with the wave, <Tex
						math={`${LA}' = e^{-${ETA}}${LA}`}
						trust
					/>, and at 0.6c <Tex math={'e^{-\\ln 2} = \\tfrac12'} />: the energy density, <Tex
						math={`\\tfrac12\\varepsilon_0|${LA}|^2`}
						trust
					/>, falls to a quarter. You found <Tex
						math={`|${LA}'|/|${LA}| = ${three(found3.factor)}`}
						trust
					/> and <Tex math={`|${LA}'|^2/|${LA}|^2 = ${three(found3.energy)}`} trust />. The
					direction <Tex math="\boldsymbol m" /> does not change, so the sky shows one double direction
					on <Tex math="\hat k" /> throughout. Running against the wave at 0.6c doubles <Tex
						math={LA}
						trust
					/>.
				{:else}
					The answer appears once you have boosted the sensor along the wave’s direction, <Tex
						math="\hat k = \hat z"
					/>, at 0.6c, <Tex math={`${ETA} = \\ln 2`} trust />.
				{/if}
			</p>
		{/if}
	</section>

	<div class="stage">
		<div
			class={['views', { wave: mode === 'wave' }]}
			role="group"
			aria-label={description}
			{@attach clock}
		>
			{#each panels as panel, i (panel.view.axis)}
				<figure class="panel">
					<figcaption>Along <span class="it-words">{panel.view.axis}</span></figcaption>
					<svg
						viewBox="0 0 {W} {W}"
						aria-hidden="true"
						{@attach i === 0 ? fitText((value) => (u = value)) : fitText()}
					>
						<rect class="ground" x="1" y="1" width={W - 2} height={W - 2} rx="6" />
						<!-- the two axes across the view -->
						<line class="axis" x1={O - R - 4} x2={O + R + 4} y1={O} y2={O} />
						<line class="axis" x1={O} x2={O} y1={O - R - 4} y2={O + R + 4} />
						{#if one}
							{#each [-1, 1] as s (s)}
								<line
									class="tick"
									x1={O + s * one}
									x2={O + s * one}
									y1={O - 2.5 * u}
									y2={O + 2.5 * u}
								/>
								<line
									class="tick"
									y1={O - s * one}
									y2={O - s * one}
									x1={O - 2.5 * u}
									x2={O + 2.5 * u}
								/>
							{/each}
							{#if panel.oneLabel}
								<text class="small dim mid halo" x={O + one} y={O + 13 * u}>1</text>
							{/if}
						{/if}
						<text class="small axis-name halo end" x={O + R + 4} y={O + 14 * u}
							><tspan class="it">{LETTER[panel.view.right]}</tspan></text
						>
						<text class="small axis-name halo end" x={O - 7 * u} y={O - R + 6 * u}
							><tspan class="it">{LETTER[panel.view.up]}</tspan></text
						>
						<!-- the view's own axis, toward the reader -->
						<g class="toward">
							<circle cx={10 * u} cy={10 * u} r={4 * u} />
							<circle class="pip" cx={10 * u} cy={10 * u} r={1.2 * u} />
							<text class="small axis-name" x={17 * u} y={13.5 * u}
								><tspan class="it">{panel.view.axis}</tspan></text
							>
						</g>

						<!-- the sensor's velocity through the room, in its own axes -->
						{#if panel.V?.kind === 'line'}
							<g class="arrow obs">
								<path class="shaft" d={panel.V.shaft} />
								<path class="head" d={panel.V.head} />
							</g>
						{:else if panel.V?.kind === 'point'}
							<g class="ring obs">
								<circle cx={O} cy={O} r={14 * u} />
								{#if panel.V.toward}<circle class="pip" cx={O} cy={O} r={1.5 * u} />{/if}
							</g>
						{/if}

						<!-- cB, dashed, then E, solid -->
						{#if panel.B?.kind === 'line'}
							<g class="arrow light dashed">
								<path class="shaft" d={panel.B.shaft} />
								<path class="head" d={panel.B.head} />
							</g>
						{:else if panel.B?.kind === 'point'}
							<g class="ring light dashed">
								<circle cx={O} cy={O} r={10 * u} />
								{#if !panel.B.toward}
									<path
										d="M{O - 7 * u},{O - 7 * u}L{O + 7 * u},{O + 7 * u}M{O - 7 * u},{O + 7 * u}L{O +
											7 * u},{O - 7 * u}"
									/>
								{/if}
							</g>
						{/if}
						{#if panel.E?.kind === 'line'}
							<g class="arrow light">
								<path class="shaft" d={panel.E.shaft} />
								<path class="head" d={panel.E.head} />
							</g>
						{:else if panel.E?.kind === 'point'}
							<g class="ring light">
								<circle cx={O} cy={O} r={6 * u} />
								{#if panel.E.toward}
									<circle class="pip fill" cx={O} cy={O} r={1.8 * u} />
								{:else}
									<path
										d="M{O - 4 * u},{O - 4 * u}L{O + 4 * u},{O + 4 * u}M{O - 4 * u},{O + 4 * u}L{O +
											4 * u},{O - 4 * u}"
									/>
								{/if}
							</g>
						{/if}
						{#if panel.B?.kind === 'point' && panel.B.toward}
							<circle class="pip fill-light" cx={O} cy={O} r={1.6 * u} />
						{/if}
						{@render arrowName('v', panel.vAt)}
						{@render arrowName('B', panel.bAt)}
						{@render arrowName('E', panel.eAt)}
					</svg>
				</figure>
			{/each}

			<figure class="panel">
				<figcaption>The sky</figcaption>
				<svg viewBox="0 0 {W} {W}" aria-hidden="true" {@attach fitText()}>
					<rect class="ground" x="1" y="1" width={W - 2} height={W - 2} rx="6" />
					<circle class="sphere" cx={O} cy={O} r={SKY_R} />
					<path class="great back" d={equator.back} />
					<path class="great back" d={meridian.back} />
					<path class="great" d={equator.front} />
					<path class="great" d={meridian.front} />
					{#each skyAxes as ax (ax.name)}
						<line
							class={['sky-axis', { back: !ax.p.front }]}
							x1={O}
							y1={O}
							x2={ax.p.x}
							y2={ax.p.y}
						/>
						<text
							class={['small axis-name halo mid', { faint: !ax.p.front }]}
							x={ax.label.x}
							y={ax.label.y + 4 * u}><tspan class="it">{ax.name}</tspan></text
						>
					{/each}
					{#each dirs as d, j (j)}
						<line class={['pnd-line', { back: !d.front }]} x1={O} y1={O} x2={d.x} y2={d.y} />
					{/each}
					<circle class="sensor" cx={O} cy={O} r={3 * u} />
					{#each dirs as d, j (j)}
						{#if d.double}
							<circle class="pnd-ring" cx={d.x} cy={d.y} r={7.5 * u} />
						{/if}
						<circle class={['pnd', { back: !d.front }]} cx={d.x} cy={d.y} r={4.2 * u} />
					{/each}
					{#if pnd?.double}
						<text
							class="small light-words halo"
							x={dirs[0].x + (dirs[0].x > O ? -10 : 10) * u}
							y={dirs[0].y + 4 * u}
							text-anchor={dirs[0].x > O ? 'end' : 'start'}>double</text
						>
					{/if}
				</svg>
			</figure>

			{#if mode === 'wave'}
				<figure class="panel">
					<figcaption><span class="it-words">a</span> in the complex plane</figcaption>
					<svg viewBox="0 0 {W} {W}" aria-hidden="true" {@attach fitText()}>
						<rect class="ground" x="1" y="1" width={W - 2} height={W - 2} rx="6" />
						<line class="axis" x1={O - R - 4} x2={O + R + 4} y1={O} y2={O} />
						<line class="axis" x1={O} x2={O} y1={O - R - 4} y2={O + R + 4} />
						<text class="small axis-name halo end" x={O + R + 4} y={O + 13 * u}>Re</text>
						<text class="small axis-name halo" x={O + 5 * u} y={O - R + 4 * u}>Im</text>
						<circle class="path rest" cx={O} cy={O} r={cabs(a0) * ak} />
						{#if a1}
							<circle class="path now" cx={O} cy={O} r={cabs(a1.a) * ak} />
						{/if}
						{#if !aSame}
							{@const p = aPt(a0)}
							<circle class="a-rest" cx={p.x} cy={p.y} r={3.5 * u} />
							<text class="name halo mid dim-name" x={inside(p.x + 10 * u)} y={p.y - 7 * u}
								><tspan class="it">a</tspan></text
							>
						{/if}
						{#if a1}
							{@const q = aPt(a1.a)}
							<circle class="a-now" cx={q.x} cy={q.y} r={4 * u} />
							<text class="name halo mid light-words" x={inside(q.x + 10 * u)} y={q.y - 7 * u}
								><tspan class="it">a</tspan>{aSame ? '' : '′'}</text
							>
						{/if}
					</svg>
				</figure>
			{/if}
		</div>

		<ul class="legend" aria-hidden="true">
			<li><span class="swatch e-key"></span><span><Tex math={VE} trust /></span></li>
			<li><span class="swatch b-key"></span><span><Tex math={VB} trust /></span></li>
			<li>
				<span class="swatch v-key"></span><span
					>the sensor’s velocity <Tex math="\boldsymbol v/c" />, in its own axes</span
				>
			</li>
			<li>
				<span class="dot-key"></span><span
					>light’s two directions, <Tex math={`\\boldsymbol m(z)\\cdot${VF} = 0`} trust /> (hollow behind
					the sky)</span
				>
			</li>
			<li><span class="ring-key"></span><span>an arrow toward you (dot) or away (cross)</span></li>
		</ul>
	</div>

	<div class="bar">
		<Segmented label="Field" options={MODES} bind:value={() => mode, setMode} />

		{#if mode === 'static'}
			<div class="group">
				<p class="group-name">The field at rest</p>
				<div class="components">
					{#each ['E', 'B'] as const as which (which)}
						{#each COMPONENTS as i (i)}
							<Slider
								id="{uid}-{which}{i}"
								label="{which === 'E' ? 'E' : 'cB'} along {LETTER[i]}"
								min={-1}
								max={1}
								step={0.05}
								bind:value={() => rest[which][i], (val) => setComponent(which, i, val)}
								readout={n3(rest[which][i])}
							/>
						{/each}
					{/each}
				</div>
				<div class="actions">
					<button type="button" class="action" onclick={toCharge}>
						<HugeiconsIcon icon={RefreshIcon} size={16} strokeWidth={1.7} />
						Back to the charge
					</button>
					<button type="button" class="action" onclick={startHere}>
						<HugeiconsIcon icon={Target02Icon} size={16} strokeWidth={1.7} />
						Start from this sensor
					</button>
				</div>
			</div>
		{:else if !reduced.current}
			<div class="actions">
				<button
					type="button"
					class="action"
					aria-pressed={playing}
					onclick={() => (playing = !playing)}
				>
					{#if playing}
						<HugeiconsIcon icon={PauseIcon} size={16} strokeWidth={1.8} />
						Hold the wave
					{:else}
						<HugeiconsIcon icon={PlayIcon} size={16} strokeWidth={1.8} />
						Let the wave pass
					{/if}
				</button>
			</div>
		{/if}

		<div class="group">
			<p class="group-name">The boost</p>
			<div onkeydowncapture={rapidityKeys} role="presentation">
				<Slider
					id="{uid}-eta"
					label="Rapidity"
					icon={DashboardSpeed02Icon}
					min={RAPIDITY.min}
					max={RAPIDITY.max}
					step={RAPIDITY.step}
					bind:value={() => eta, setEta}
					readout="η = {etaWords(eta)}, β = {n3(sp.beta)}, γ = {n3(sp.gamma)}"
					ends={['−2', '2']}
					marks={[
						{ at: -LN2, label: 'η = −ln 2, 0.6c the other way' },
						{ at: 0, label: 'η = 0, at rest' },
						{ at: LN2, label: 'η = ln 2, 0.6c' }
					]}
					marksHint="the ticks mark rest and 0.6c either way"
				/>
			</div>
			<Segmented
				label="Direction of the boost"
				options={DIRECTIONS}
				bind:value={() => direction, setDirection}
			/>
		</div>

		<div class="group">
			<p class="group-name">The turn of the sensor’s axes</p>
			<Slider
				id="{uid}-turn"
				label="Angle"
				icon={Rotate01Icon}
				min={TURN.min}
				max={TURN.max}
				step={TURN.step}
				bind:value={() => turn, setTurn}
				readout="θ = {turn < 0 ? '−' : ''}{Math.abs(turn)}°"
				ends={['−180°', '180°']}
				marks={[
					{ at: -90, label: 'θ = −90°' },
					{ at: 0, label: 'θ = 0, not turned' },
					{ at: 90, label: 'θ = 90°' }
				]}
				marksHint="the ticks mark no turn and a quarter turn either way"
			/>
			<Segmented
				label="Axis of the turn"
				options={TURN_AXES}
				bind:value={() => turnAxis, setTurnAxis}
			/>
		</div>

		<p class="hint">
			Reach each slider and choice with Tab; the arrow keys move them. The rapidity steps by 0.05
			with the arrow keys and by 0.5 with Page Up and Page Down; the fields at rest by 0.05, the
			angle by 5°. The boost acts first, then the turn.
		</p>
	</div>

	<div class="readouts">
		<dl>
			<div class="row">
				<dt>The sensor</dt>
				<dd>
					{@render eq([`${ETA} = ${etaTex(eta)}`])}
					{@render eq([`${BETA} = \\tanh${ETA}`, `= ${n3(sp.beta).replace('−', '-')}`])}
					{@render eq([`${GAMMA} = \\cosh${ETA}`, `= ${n3(sp.gamma)}`])}
					<span class="also"
						>{#if eta === 0}at rest{:else}moving along {directionWords}{/if}{#if turn !== 0}, its
							axes turned by {turn}° about {turnAxis}{/if}</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>It reads</dt>
				<dd>
					<table class="reads">
						<thead>
							<tr>
								<th scope="col"><span class="sr">component</span></th>
								<th scope="col"><Tex math={VE} trust /></th>
								<th scope="col"><Tex math={VB} trust /></th>
								<th scope="col"><Tex math={`${VF} = ${VE} + i${VB}`} trust /></th>
							</tr>
						</thead>
						<tbody>
							{#each COMPONENTS as i (i)}
								<tr>
									<th scope="row"><Tex math={LETTER[i]} /></th>
									<td>{n3(f.E[i])}</td>
									<td>{n3(f.B[i])}</td>
									<td class="complex">{cplx(F[i])}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</dd>
			</div>
			<div class="row">
				<dt>Kept</dt>
				<dd aria-live="polite">
					{@render eq([`${LE}^2 - c^2${LB}^2`, `= ${n3(inv.difference).replace('−', '-')}`])}
					{@render eq([`c\\,${VE}\\cdot ${VBB}`, `= ${n3(inv.product).replace('−', '-')}`])}
					<span class="also"
						>the real part and half the imaginary part of <Tex math={`${VF}\\cdot${VF}`} trust />;
						at rest they were {n3(inv0.difference)} and {n3(inv0.product)}, for every sensor alike.</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Not kept</dt>
				<dd>
					{@render eq([`${VF}^*\\cdot${VF} = ${LE}^2 + c^2${LB}^2`, `= ${n3(herm)}`])}
					<span class="also">at rest {n3(herm0)}: a boost changes it, a turn does not.</span>
				</dd>
			</div>
			<div class="row">
				<dt>Light’s directions</dt>
				<dd>
					{#if pnd}
						{#each pnd.dirs as d, j (j)}
							{@render eq([
								`z${pnd.double ? '' : `_${j + 1}`} = ${d.z ? complexTex({ re: clean(d.z.re), im: clean(d.z.im) }) : '\\infty'}`,
								`,\\ \\hat n = ${vecTex(d.n.map(clean) as V3)}`
							])}
						{/each}
						<span class="also"
							>{#if pnd.double}one double root: the field is null, <Tex
									math={`${VF}\\cdot${VF} = 0`}
									trust
								/>{:else}the roots of <Tex
									math={`\\boldsymbol m(z)\\cdot${VF} = 0`}
									trust
								/>{/if}</span
						>
					{:else}
						<span class="also">no field, no directions</span>
					{/if}
				</dd>
			</div>
			{#if mode === 'wave' && a1}
				<div class="row">
					<dt>The amplitude</dt>
					<dd>
						{@render eq([`${LA} = ${complexTex({ re: clean(a0.re), im: clean(a0.im) })}`])}
						{@render eq([`${LA}' = ${complexTex({ re: clean(a1.a.re), im: clean(a1.a.im) })}`])}
						{@render eq([`|${LA}'|/|${LA}|`, `= ${n3(cabs(a1.a) / cabs(a0))}`])}
						{@render eq([`|${LA}'|^2/|${LA}|^2`, `= ${n3((cabs(a1.a) / cabs(a0)) ** 2)}`])}
						<span class="also"
							>the energy density goes as <Tex math={`|${LA}|^2`} trust />; the wave travels along <Tex
								math={`\\hat k = ${vecTex(a1.k.map(clean) as V3)}`}
							/> for the sensor.</span
						>
					</dd>
				</div>
			{/if}
		</dl>
		<p class="note">
			The fields are in an arbitrary unit, with the field of the opening charge 1; the charge sits
			on the <Tex math="x" /> axis, on its negative side, so that its field points along <Tex
				math="+x"
			/>.
			{#if mode === 'wave'}The wave travels along <Tex math="z" /> with <Tex
					math={`${LA} = \\sqrt2\\,e^{i\\omega t}`}
					trust
				/>, circularly polarized, so that <Tex math={`${VE} = (1, 0, 0)`} trust /> and <Tex
					math={`${VB} = (0, 1, 0)`}
					trust
				/> at <Tex math="\omega t = 0" />; <Tex math={`${LA}'`} trust /> is read in axes across the wave’s
				direction for the sensor.
			{/if}
			The sensor moves with the velocity <Tex math={`c\\tanh${ETA}\\,\\hat u`} trust /> and reads <Tex
				math={`${VF}'_\\perp = \\cosh${ETA}\\,${VF}_\\perp - i\\sinh${ETA}\\,\\hat u\\times${VF}`}
				trust
			/>; its axes are then turned by <Tex math="\theta" />, with <Tex math="\cos\theta" /> and <Tex
				math="\sin\theta"
			/> in place of <Tex math={`\\cosh${ETA}`} trust /> and <Tex math={`i\\sinh${ETA}`} trust />.
			Each view has its axis toward you, and the sky is seen from outside, from a little to the
			right of
			<Tex math="-y" /> and above. The rapidity lands exactly on <Tex math="0" />, <Tex
				math="\pm\ln 2"
			/>,
			<Tex math="\pm\tfrac12\ln 3" /> and <Tex math="\pm\ln 4" /> within 0.0075 of them.
		</p>
	</div>
</div>

<style>
	.complex-field {
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

	.views {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 0.5rem;
	}

	.views.wave {
		grid-template-columns: repeat(5, minmax(0, 1fr));
	}

	figure {
		margin: 0;
		min-width: 0;
	}

	figcaption {
		margin: 0 0 0.2rem 0.15rem;
		font: 500 0.72rem/1.3 var(--font-sans);
		color: var(--text-dim);
	}

	.it-words {
		font-family: KaTeX_Math, var(--font-serif);
		font-style: italic;
		font-size: 1.1em;
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
	}

	.small {
		font-size: calc(10.5px * var(--u, 1));
	}

	.mid {
		text-anchor: middle;
	}

	.end {
		text-anchor: end;
	}

	.dim {
		fill: var(--text-faint);
		font-variant-numeric: tabular-nums;
	}

	.it {
		font-family: KaTeX_Math, var(--font-serif);
		font-style: italic;
		font-size: 1.1em;
	}

	/* a vector, in bold italic, as the chapter's */
	.bold {
		font-family: KaTeX_Math, var(--font-serif);
		font-style: italic;
		font-weight: 700;
		font-size: 1.1em;
	}

	.halo {
		paint-order: stroke;
		stroke: var(--bg-sunken);
		stroke-width: calc(3px * var(--u, 1));
		stroke-linejoin: round;
	}

	.name {
		font: 600 calc(12px * var(--u, 1)) / 1 var(--font-sans);
	}

	text.light-words {
		fill: var(--light);
	}

	text.obs-words {
		fill: var(--obs);
	}

	text.dim-name {
		fill: var(--text-dim);
	}

	text.axis-name {
		fill: var(--text-dim);
	}

	text.faint {
		opacity: 0.55;
	}

	.ground {
		fill: color-mix(in srgb, var(--text) 3%, transparent);
		stroke: var(--line);
		stroke-width: calc(1px * var(--u, 1));
	}

	.axis {
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.tick {
		stroke: color-mix(in srgb, var(--text) 55%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.toward circle {
		fill: none;
		stroke: var(--text-dim);
		stroke-width: calc(1px * var(--u, 1));
	}

	.toward circle.pip {
		fill: var(--text-dim);
		stroke: none;
	}

	.arrow.light {
		--c: var(--light);
	}

	.arrow.obs,
	.ring.obs {
		--c: var(--obs);
	}

	.shaft {
		fill: none;
		stroke: var(--c);
		stroke-width: calc(2.2px * var(--u, 1));
		stroke-linecap: round;
	}

	.arrow.obs .shaft {
		stroke-width: calc(1.4px * var(--u, 1));
	}

	.dashed .shaft {
		stroke-linecap: butt;
		stroke-dasharray: calc(4px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.head {
		fill: var(--c);
		stroke: var(--bg-sunken);
		stroke-width: calc(0.8px * var(--u, 1));
		stroke-linejoin: round;
	}

	.ring {
		fill: none;
		stroke: var(--light);
		stroke-width: calc(1.8px * var(--u, 1));
	}

	.ring.obs {
		stroke: var(--obs);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.ring.dashed circle {
		stroke-dasharray: calc(3px * var(--u, 1)) calc(2.5px * var(--u, 1));
	}

	.ring path {
		stroke-linecap: round;
	}

	.ring .pip,
	.pip.fill,
	.pip.fill-light {
		fill: var(--light);
		stroke: none;
	}

	.ring.obs .pip {
		fill: var(--obs);
	}

	/* the sky */
	.sphere {
		fill: color-mix(in srgb, var(--text) 4%, transparent);
		stroke: color-mix(in srgb, var(--text) 55%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.great {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 28%, transparent);
		stroke-width: calc(0.9px * var(--u, 1));
	}

	.great.back,
	.sky-axis.back,
	.pnd-line.back {
		stroke-dasharray: calc(1.5px * var(--u, 1)) calc(2.5px * var(--u, 1));
	}

	.sky-axis {
		stroke: color-mix(in srgb, var(--text) 35%, transparent);
		stroke-width: calc(0.9px * var(--u, 1));
	}

	.pnd-line {
		stroke: color-mix(in srgb, var(--light) 70%, transparent);
		stroke-width: calc(1.1px * var(--u, 1));
	}

	.sensor {
		fill: var(--bg-sunken);
		stroke: var(--text);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.pnd {
		fill: var(--light);
		stroke: var(--bg-sunken);
		stroke-width: calc(1px * var(--u, 1));
	}

	.pnd.back {
		fill: var(--bg-sunken);
		stroke: var(--light);
		stroke-width: calc(1.6px * var(--u, 1));
	}

	.pnd-ring {
		fill: none;
		stroke: var(--light);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	/* the complex plane */
	.path {
		fill: none;
		stroke-width: calc(1px * var(--u, 1));
	}

	.path.rest {
		stroke: color-mix(in srgb, var(--text) 35%, transparent);
		stroke-dasharray: calc(2px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.path.now {
		stroke: color-mix(in srgb, var(--light) 75%, transparent);
	}

	.a-rest {
		fill: var(--bg-sunken);
		stroke: var(--text-dim);
		stroke-width: calc(1.4px * var(--u, 1));
	}

	.a-now {
		fill: var(--light);
		stroke: var(--bg-sunken);
		stroke-width: calc(1px * var(--u, 1));
	}

	/* --- the legend ------------------------------------------------------------------------- */

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem 1rem;
		margin: 0.5rem 0.2rem 0;
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

	.e-key {
		border-color: var(--light);
	}

	.b-key {
		border-top-style: dashed;
		border-color: var(--light);
	}

	.v-key {
		border-top-width: 1.5px;
		border-color: var(--obs);
	}

	.dot-key {
		flex: none;
		width: 0.55rem;
		height: 0.55rem;
		border-radius: 50%;
		background: var(--light);
	}

	.ring-key {
		flex: none;
		width: 0.6rem;
		height: 0.6rem;
		border-radius: 50%;
		border: 1.5px solid var(--light);
		background: radial-gradient(circle, var(--light) 0 22%, transparent 24%);
	}

	/* --- the controls and the numbers ------------------------------------------------------- */

	.bar {
		display: grid;
		gap: 0.8rem;
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.group {
		display: grid;
		gap: 0.55rem;
	}

	.group-name {
		margin: 0;
		font: italic 400 0.92rem/1.3 var(--font-serif);
		color: var(--text-faint);
	}

	.components {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.55rem 1.1rem;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
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

	.eq {
		display: inline-flex;
		flex-wrap: wrap;
		align-items: baseline;
		min-width: 0;
		max-width: 100%;
	}

	.also {
		color: var(--text-dim);
		text-wrap: pretty;
		font-variant-numeric: normal;
	}

	.reads {
		border-collapse: collapse;
		font-variant-numeric: tabular-nums;
		margin: 0;
		width: auto;
	}

	.reads th,
	.reads td {
		padding: 0.1rem 1rem 0.1rem 0;
		border: 0;
		background: none;
		text-align: right;
		font-weight: 400;
		white-space: nowrap;
	}

	.reads thead th {
		color: var(--text-dim);
		border-bottom: 1px solid var(--line);
	}

	.reads tbody th {
		text-align: left;
	}

	.reads td.complex {
		text-align: left;
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

		.views,
		.views.wave {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.views.wave .panel:last-child {
			grid-column: 1 / -1;
			justify-self: center;
			width: calc(50% - 0.25rem);
		}

		.components {
			grid-template-columns: minmax(0, 1fr);
		}

		.row {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.1rem;
		}

		.reads th,
		.reads td {
			padding-right: 0.7rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.action {
			transition: none;
		}
	}
</style>
