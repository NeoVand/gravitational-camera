<script lang="ts">
	/**
	 * Chapter 13.5's impulsive front. Left, the plane of the front from −3R to 3R, with a body of 200 seeded particles
	 * in a disc of radius R, the contours of the profile H at equal steps, and an arrow on each particle for its kick
	 * ½q∇H over its mass, to one stated scale. The profile is Aichelburg and Sexl's −k ln|x⊥ − b|, with the crossing
	 * point b dragged (pointer, touch, arrow keys) and kept outside the body, and a dashed arrow on the part nearest b
	 * for Newton's kick for the same energy; the quadrupolar (x² − y²)/2f, with the stretched axis in orange and the
	 * squeezed in blue; or the real part of 13.2's pair, Re e^{ζ₊·x⊥}, with |ξ| and its direction on sliders. Right,
	 * bars for E₊ − E₀, E₋ − E₀ and their sum, from the paper's eq:proof-shock per particle, beside ¼Σ c q|∇H|², and
	 * the rest mass M₊² + M₋² − 2M₀² beside Q²Var(∇H)/2c². Below, three test particles crossing where |∇H| on the body
	 * is largest. Sliders set the strength (the largest |∇H| on the body) and the body's rapidity along z, buttons the
	 * sign of H. The arithmetic is in ./impulsive-front.ts. The chapter's try box asks the prediction, so the figure
	 * answers it in no words: it shows live values only. Nothing moves by itself; under reduced motion the bars change
	 * without easing.
	 */
	import { MediaQuery } from 'svelte/reactivity';
	import {
		ArrowExpand01Icon,
		Compass01Icon,
		FlashIcon,
		MinusSignIcon,
		PlusSignIcon,
		Rocket01Icon,
		Target03Icon,
		WaveIcon
	} from '@hugeicons/core-free-icons';
	import Segmented from '../../ui/controls/Segmented.svelte';
	import Slider from '../../ui/controls/Slider.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import { sci, texNumber } from '../../ui/format';
	import {
		BODY,
		BASE,
		B_STEP,
		OPENING,
		RAPIDITY,
		STIR,
		STRENGTH,
		TURN,
		VIEW,
		XI,
		arrowScale,
		clamp,
		contours,
		keepOut,
		qOverMc,
		reading,
		testParticles,
		unitShape,
		type Profile,
		type Sign,
		type Vec
	} from './impulsive-front';

	const uid = $props.id();

	// --- the settings ---------------------------------------------------------------------------------------------
	let profile = $state<Profile>(OPENING.profile);
	let b = $state<Vec>([...OPENING.b]);
	let strength = $state(OPENING.strength);
	let sign = $state<Sign>(OPENING.sign);
	let rapidity = $state(OPENING.rapidity);
	let xi = $state(OPENING.xi);
	let turn = $state(OPENING.turn);

	const snap = (v: number, step: number, lo: number, hi: number) =>
		clamp(Math.round(v / step) * step, lo, hi);
	const setStrength = (v: number) =>
		(strength = snap(v, STRENGTH.step, STRENGTH.min, STRENGTH.max));
	const setRapidity = (v: number) =>
		(rapidity = snap(v, RAPIDITY.step, RAPIDITY.min, RAPIDITY.max));
	const setXi = (v: number) => (xi = snap(v, XI.step, XI.min, XI.max));
	const setTurn = (v: number) => (turn = snap(v, TURN.step, TURN.min, TURN.max));

	const settings = $derived({ profile, b, strength, sign, rapidity, xi, turn });
	const r = $derived(reading(settings));
	const scale = $derived(arrowScale(strength, rapidity));
	/** The contours of the unit profile: they change with its shape only, and the sign turns their levels over. */
	const lines = $derived(contours(unitShape({ profile, b, xi, turn })));
	const largestGrad = $derived(r.grad[r.largest]);
	const tests = $derived(testParticles(largestGrad));

	// --- the plane ----------------------------------------------------------------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	/** The plane is SIDE drawing units across, 2 VIEW in R. */
	const SIDE = 360;
	const UNIT = SIDE / (2 * VIEW);
	const X = (x: number) => SIDE / 2 + UNIT * x;
	const Y = (y: number) => SIDE / 2 - UNIT * y;
	/** Drawing units in one CSS pixel. */
	let u = $state(1);
	const f1 = (x: number) => x.toFixed(1);
	/** A signed number for the reader, with a true minus sign. */
	const signed = (x: number, digits = 2) =>
		x
			.toFixed(digits)
			.replace(/^-/, '−')
			.replace(/^−0\.0+$/, '0.00');
	const f2 = (x: number) => x.toFixed(2);

	/**
	 * The contours as two paths, where H > 0 and where H < 0, after the sign. Aichelburg and Sexl's are circles round
	 * b, of radius e^{−level} for the unit profile −ln|x⊥ − b|, drawn exactly; the others are marching squares'.
	 */
	const contourPaths = $derived.by(() => {
		let [above, below] = ['', ''];
		for (const { level, segments } of lines.levels) {
			let d = '';
			if (profile === 'as') {
				const radius = UNIT * Math.exp(-level * lines.step);
				const [cx, cy] = [X(b[0]), Y(b[1])];
				if (radius > 1.2)
					d = `M${f1(cx - radius)},${f1(cy)}a${f1(radius)},${f1(radius)} 0 1,0 ${f1(2 * radius)},0a${f1(radius)},${f1(radius)} 0 1,0 ${f1(-2 * radius)},0`;
			} else
				for (const [p, q] of segments)
					d += `M${f1(X(p[0]))},${f1(Y(p[1]))}L${f1(X(q[0]))},${f1(Y(q[1]))}`;
			if (sign * level >= 0) above += d;
			else below += d;
		}
		return { above, below };
	});

	/** An arrow from (x, y) in R along the kick v in c, at the figure's scale, as a shaft and a head. */
	function arrowPath(x: number, y: number, v: Vec, perC: number, head = 4.2, aside = 0) {
		const [dx, dy] = [v[0] * perC * UNIT, -v[1] * perC * UNIT];
		const length = Math.hypot(dx, dy);
		if (length < 1e-6) return { shaft: '', head: '' };
		const [ux, uy] = [dx / length, dy / length];
		// moved `aside` pixels to the left of its direction, to lie beside an arrow from the same place
		const [x0, y0] = [X(x) + uy * aside * u, Y(y) - ux * aside * u];
		const [x1, y1] = [x0 + dx, y0 + dy];
		const h = Math.min(head * u, 0.55 * length);
		const half = 0.45 * h;
		const [xb, yb] = [x1 - ux * h, y1 - uy * h];
		return {
			shaft: `M${f2(x0)},${f2(y0)}L${f2(xb)},${f2(yb)}`,
			head: `M${f2(x1)},${f2(y1)}L${f2(xb - uy * half)},${f2(yb + ux * half)}L${f2(xb + uy * half)},${f2(yb - ux * half)}Z`
		};
	}

	/** All the kicks as one path of shafts and one of heads. */
	const kicks = $derived.by(() => {
		let [shafts, heads] = ['', ''];
		BODY.forEach((p, a) => {
			const arrow = arrowPath(p.x, p.y, r.kick[a], scale.perC);
			shafts += arrow.shaft;
			heads += arrow.head;
		});
		return { shafts, heads };
	});

	const newtonArrow = $derived(
		r.newton
			? arrowPath(BODY[r.newton.at].x, BODY[r.newton.at].y, r.newton.kick, scale.perC, 3.6, 5)
			: undefined
	);
	const nearest = $derived(r.newton ? BODY[r.newton.at] : undefined);

	/** The scale's key, in the lower left corner: an arrow BASE R long. */
	const KEY = { x: -VIEW + 0.2, y: -VIEW + 0.3 };
	const keyArrow = $derived(arrowPath(KEY.x, KEY.y, [scale.unit, 0], scale.perC));

	/** For the quadrupole, the axis that is stretched (orange) and the one squeezed (blue): x and y for +H. */
	const stretchedAlongX = $derived(sign === 1);

	// --- dragging and the keys -------------------------------------------------------------------------------------
	let svg: SVGSVGElement | undefined = $state();
	let dragging = $state(false);

	function follow(e: PointerEvent) {
		if (!dragging || !svg) return;
		const m = svg.getScreenCTM();
		if (!m) return;
		const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
		b = keepOut([(p.x - SIDE / 2) / UNIT, -(p.y - SIDE / 2) / UNIT]);
	}

	function press(e: PointerEvent) {
		dragging = true;
		(e.currentTarget as Element).setPointerCapture(e.pointerId);
		follow(e);
	}

	function release() {
		dragging = false;
	}

	/** The arrow keys move b by 0.05 R, or 0.25 R with Shift. */
	function handleKeys(e: KeyboardEvent) {
		const by = {
			ArrowLeft: [-1, 0],
			ArrowRight: [1, 0],
			ArrowUp: [0, 1],
			ArrowDown: [0, -1]
		}[e.key];
		if (!by) return;
		e.preventDefault();
		const step = e.shiftKey ? 5 * B_STEP : B_STEP;
		b = keepOut([b[0] + by[0] * step, b[1] + by[1] * step]);
	}

	// --- the words --------------------------------------------------------------------------------------------------
	const M = '\\htmlClass{q-matter}{M}';
	const N = '\\htmlClass{q-matter}{\\mathcal N}';
	const BARS = [
		{ key: 'plus', tex: 'E_+ - E_0', words: 'after the wave' },
		{ key: 'minus', tex: 'E_- - E_0', words: 'after its reverse' },
		{ key: 'sum', tex: 'E_+ + E_- - 2E_0', words: 'the sum' },
		{
			key: 'crossing',
			tex: `\\tfrac14\\textstyle\\sum_a c\\,q_a|\\nabla H(\\boldsymbol{x}_a)|^2`,
			words: 'the integral over the front,',
			also: `\\tfrac14\\int|\\nabla H|^2${N}\\,\\mathrm d^2x_\\perp`
		}
	] as const;

	/** The bars on one axis, which takes in zero and every value. */
	const values = $derived({ plus: r.plus, minus: r.minus, sum: r.sum, crossing: r.crossing });
	const axis = $derived.by(() => {
		const all = Object.values(values);
		const lo = Math.min(0, ...all);
		const hi = Math.max(0, ...all);
		const span = hi - lo || 1;
		const at = (v: number) => (v - lo) / span;
		return { zero: at(0), at };
	});
	const barStyle = (v: number) => {
		const [a, z] = [axis.at(v), axis.zero];
		return {
			left: `${(100 * Math.min(a, z)).toFixed(2)}%`,
			width: `${(100 * Math.abs(a - z)).toFixed(2)}%`
		};
	};
	const shownValue = (key: (typeof BARS)[number]['key'], v: number) =>
		texNumber(v, key === 'sum' || key === 'crossing' ? 7 : 3);

	const PROFILES = $derived([
		{
			value: 'as' as const,
			label: phone.current ? 'Massless' : 'Aichelburg–Sexl',
			icon: Target03Icon
		},
		{ value: 'quad' as const, label: 'Quadrupolar', icon: ArrowExpand01Icon },
		{ value: 'pair' as const, label: '13.2’s pair', icon: WaveIcon }
	]);
	const SIGNS = [
		{ value: 'plus' as const, label: '+H', icon: PlusSignIcon },
		{ value: 'minus' as const, label: '−H', icon: MinusSignIcon }
	];
	const signChoice = {
		get: () => (sign === 1 ? 'plus' : 'minus'),
		set: (v: 'plus' | 'minus') => (sign = v === 'plus' ? 1 : -1)
	};

	const ratio = $derived(qOverMc(rapidity));
	const ratioText = $derived(ratio >= 0.1 ? ratio.toFixed(2) : ratio.toFixed(3));
	const strengthText = $derived(sci(10 ** strength));
	const stirText = sci(STIR);

	/** The profile's own length, before the sign: k = 8Gp/c³, f, or A, in R. */
	const amplitudeTex = $derived(
		profile === 'as'
			? `k = 8Gp/c^3 = ${texNumber(r.amplitude, 2)}\\,R`
			: profile === 'quad'
				? `f = ${texNumber(1 / r.amplitude, 3)}\\,R`
				: `A = ${texNumber(r.amplitude, 2)}\\,R`
	);
	const profileTex = $derived(
		{
			as: [
				'H = -k\\ln|\\boldsymbol{x}_\\perp - \\boldsymbol{b}|',
				'H = k\\ln|\\boldsymbol{x}_\\perp - \\boldsymbol{b}|'
			],
			quad: ['H = (x^2 - y^2)/2f', 'H = -(x^2 - y^2)/2f'],
			pair: [
				'H = A\\,\\mathrm{Re}\\,e^{\\boldsymbol\\zeta_+\\cdot\\boldsymbol{x}_\\perp}',
				'H = -A\\,\\mathrm{Re}\\,e^{\\boldsymbol\\zeta_+\\cdot\\boldsymbol{x}_\\perp}'
			]
		}[profile][sign === 1 ? 0 : 1]
	);

	const bText = $derived(`b = (${signed(b[0])} R, ${signed(b[1])} R)`);
	const nearestText = $derived(
		nearest ? `${Math.hypot(b[0] - nearest.x, b[1] - nearest.y).toFixed(2)} R` : ''
	);

	const description = $derived(
		`The plane of the front, from −3 R to 3 R, with the body of 200 particles in a disc of radius R at its ` +
			`centre and the contours of the profile at equal steps. ` +
			(profile === 'as'
				? `Aichelburg and Sexl’s profile, crossing at ${bText}, ${nearestText} from the nearest part, which ` +
					`carries a dashed arrow for Newton’s kick. `
				: profile === 'quad'
					? `The quadrupolar profile. `
					: `The real part of 13.2’s pair, |ξ| = ${xi.toFixed(2)}/R at ${turn}°. `) +
			`An arrow on each particle gives its kick; an arrow ${BASE.toFixed(2)} R long is ${strengthText} c ` +
			`over two${scale.tenths ? ', times ten' : ''}.`
	);

	const testText = $derived(
		`at (${signed(BODY[r.largest].x)} R, ${signed(BODY[r.largest].y)} R), where |∇H| on the body is largest`
	);

	/** The test particles' sideways velocities, in their own strip, a photon's c|∇H| drawn 24 pixels long. */
	const GLYPH = 64;
	const testArrow = (size: number) => {
		const g = largestGrad;
		const n = Math.hypot(g[0], g[1]) || 1;
		const length = 24 * size;
		const [dx, dy] = [(g[0] / n) * length, (-g[1] / n) * length];
		const [x0, y0] = [GLYPH / 2 - dx / 2, GLYPH / 2 - dy / 2];
		const [x1, y1] = [x0 + dx, y0 + dy];
		const [ux, uy] = [dx / length, dy / length];
		const h = 5;
		const [xb, yb] = [x1 - ux * h, y1 - uy * h];
		return {
			from: [x0, y0],
			shaft: `M${f2(x0)},${f2(y0)}L${f2(xb)},${f2(yb)}`,
			head: `M${f2(x1)},${f2(y1)}L${f2(xb - uy * 2.4)},${f2(yb + ux * 2.4)}L${f2(xb + uy * 2.4)},${f2(yb - ux * 2.4)}Z`
		};
	};
	const grainArrow = $derived(testArrow(0.5));
	const photonArrow = $derived(testArrow(1));
</script>

{#snippet bars()}
	<ul class="bars">
		{#each BARS as bar (bar.key)}
			{@const v = values[bar.key]}
			<li class={['row', bar.key]}>
				<span class="label"
					><Tex math={bar.tex} /><span class="words"
						>{bar.words}{#if 'also' in bar}<span class="also"><Tex math={bar.also} trust /></span
							>{/if}</span
					></span
				>
				<span class="track" aria-hidden="true">
					<span class="zero" style:left="{(100 * axis.zero).toFixed(2)}%"></span>
					<span class="fill" style:left={barStyle(v).left} style:width={barStyle(v).width}></span>
				</span>
				<span class="value"><Tex math={shownValue(bar.key, v)} /></span>
			</li>
		{/each}
	</ul>
{/snippet}

<div class="impulsive-front">
	<div class="panels">
		<section class="panel" aria-label="The plane of the front">
			<div class="stage">
				<p class="heading">The plane of the front, which meets the whole body at once</p>
				<svg
					class={{ movable: profile === 'as' }}
					viewBox="0 0 {SIDE} {SIDE}"
					role="group"
					aria-label={description}
					{@attach (node: SVGSVGElement) => {
						svg = node;
						return fitText((value) => (u = value))(node);
					}}
				>
					<defs>
						<clipPath id="{uid}-view">
							<rect width={SIDE} height={SIDE} rx={6 * u} />
						</clipPath>
					</defs>
					<rect class="view" width={SIDE} height={SIDE} rx={6 * u} />

					<g clip-path="url(#{uid}-view)">
						{#if profile === 'quad'}
							<line
								class={['axis', stretchedAlongX ? 'stretch' : 'squeeze']}
								x1="0"
								x2={SIDE}
								y1={SIDE / 2}
								y2={SIDE / 2}
							/>
							<line
								class={['axis', stretchedAlongX ? 'squeeze' : 'stretch']}
								x1={SIDE / 2}
								x2={SIDE / 2}
								y1="0"
								y2={SIDE}
							/>
						{/if}
						<path class="contour" d={contourPaths.above} />
						<path class="contour below" d={contourPaths.below} />
					</g>

					<!-- the body: a disc of radius R, and its 200 particles -->
					<circle class="disc" cx={X(0)} cy={Y(0)} r={UNIT} />
					<path
						class="origin"
						d="M{X(0) - 4 * u},{Y(0)}H{X(0) + 4 * u}M{X(0)},{Y(0) - 4 * u}V{Y(0) + 4 * u}"
					/>
					{#each BODY as p, a (a)}
						<circle
							class="particle"
							cx={f1(X(p.x))}
							cy={f1(Y(p.y))}
							r={f1(1.1 + 0.65 * p.m * BODY.length)}
						/>
					{/each}

					<!-- the kicks, ½q∇H over each particle's mass, and Newton's on the part nearest b -->
					<path class="shaft" d={kicks.shafts} />
					<path class="head" d={kicks.heads} />
					{#if newtonArrow && nearest}
						<circle class="nearest" cx={f1(X(nearest.x))} cy={f1(Y(nearest.y))} r={5 * u} />
						<path class="shaft newton" d={newtonArrow.shaft} />
						<path class="head newton" d={newtonArrow.head} />
					{/if}

					<!-- the scale -->
					<path class="shaft key" d={keyArrow.shaft} />
					<path class="head key" d={keyArrow.head} />
					<text class="key-label" x={X(KEY.x)} y={Y(KEY.y) - 6 * u}
						>{sci(scale.unit)} <tspan class="it">c</tspan></text
					>

					{#if profile === 'as'}
						<rect
							class={['hit', { dragging }]}
							role="presentation"
							width={SIDE}
							height={SIDE}
							onpointerdown={press}
							onpointermove={follow}
							onpointerup={release}
							onpointercancel={release}
						/>
						<g
							class="handle"
							role="slider"
							tabindex="0"
							aria-roledescription="movable point"
							aria-label="Where the particle without mass crosses the front. The arrow keys move it by 0.05 R, with Shift by 0.25 R."
							aria-valuemin={-VIEW}
							aria-valuemax={VIEW}
							aria-valuenow={b[0]}
							aria-valuetext="{bText}, {nearestText} from the nearest part"
							onkeydown={handleKeys}
						>
							<circle class="focus" cx={f1(X(b[0]))} cy={f1(Y(b[1]))} r={13 * u} />
							<circle class="crossing" cx={f1(X(b[0]))} cy={f1(Y(b[1]))} r={5.5 * u} />
							<circle class="crossing-core" cx={f1(X(b[0]))} cy={f1(Y(b[1]))} r={1.8 * u} />
							<text
								class="b-label"
								x={f1(X(b[0]) + (b[0] > 2 ? -10 : 10) * u)}
								y={f1(Y(b[1]) - 9 * u)}
								text-anchor={b[0] > 2 ? 'end' : 'start'}>b</text
							>
						</g>
					{/if}
				</svg>
				<p class="where" aria-hidden="true">
					<Tex math={profileTex} />,
					<Tex math={amplitudeTex} />
				</p>
				<ul class="legend" aria-hidden="true">
					<li><span class="swatch particle-key"></span>a particle of the body</li>
					<li><span class="swatch kick-key"></span>its kick, to the key’s scale</li>
					{#if profile === 'as'}
						<li>
							<span class="swatch newton-key"></span>Newton’s, for the same energy, on the part at
							rest
						</li>
						<li>
							<span class="swatch crossing-key"></span>where the particle without mass crosses
						</li>
					{/if}
					<li><span class="swatch contour-key"></span>H at equal steps; dashed where H &lt; 0</li>
					{#if profile === 'quad'}
						<li>
							<span class="swatch stretch-key"></span>stretched<span class="swatch squeeze-key"
							></span>squeezed
						</li>
					{/if}
				</ul>
			</div>
		</section>

		<section class="panel energies" aria-label="The body’s energy and rest mass">
			<p class="heading">
				The body’s energy after the wave, after its reverse, and with none, in <Tex
					math={`${M}c^2`}
					trust
				/>
			</p>
			{@render bars()}

			<div class="mass">
				<p class="heading">Its rest mass, in <Tex math={`${M}^2`} trust /></p>
				<dl>
					<dt><Tex math={`${M}_+^2 + ${M}_-^2 - 2${M}_0^2`} trust /></dt>
					<dd><Tex math={texNumber(r.restMass, 7)} /></dd>
					<dt><Tex math={'Q^2\\,\\mathrm{Var}(\\nabla H)/2c^2'} /></dt>
					<dd><Tex math={texNumber(r.variance, 7)} /></dd>
				</dl>
			</div>

			<p class="small">
				Each particle has <Tex math={`q = ${ratioText}\\,mc`} />; <Tex math={N} trust /> is <Tex
					math={'c\\sum_a q_a\\,\\delta^2(\\boldsymbol{x}_\\perp - \\boldsymbol{x}_a)'}
				/>.
			</p>
		</section>
	</div>

	<section class="strip" aria-label="Three test particles crossing the front">
		<p class="heading">Three test particles crossing {testText}</p>
		<div class="tests">
			<div class="test">
				<svg class="glyph" viewBox="0 0 {GLYPH} {GLYPH}" aria-hidden="true">
					<circle class="glyph-frame" cx={GLYPH / 2} cy={GLYPH / 2} r={GLYPH / 2 - 1} />
					<path class="glyph-shaft" d={grainArrow.shaft} />
					<path class="glyph-head" d={grainArrow.head} />
					<circle class="grain" cx={grainArrow.from[0]} cy={grainArrow.from[1]} r="4" />
				</svg>
				<div class="test-words">
					<p class="name">A slow grain, <Tex math="q = mc" /></p>
					<p>
						sideways velocity <Tex
							math={`\\tfrac12c|\\nabla H| = ${texNumber(tests.grain.velocity, 2)}\\,c`}
						/>
					</p>
					<p><Tex math={`\\Delta E/E = ${texNumber(tests.grain.gain, 2)}`} /></p>
				</div>
			</div>
			<div class="test">
				<svg class="glyph" viewBox="0 0 {GLYPH} {GLYPH}" aria-hidden="true">
					<circle class="glyph-frame" cx={GLYPH / 2} cy={GLYPH / 2} r={GLYPH / 2 - 1} />
					<circle class="photon" cx={GLYPH / 2} cy={GLYPH / 2} r="3.4" />
					<circle class="photon-ring" cx={GLYPH / 2} cy={GLYPH / 2} r="7" />
				</svg>
				<div class="test-words">
					<p class="name">A photon along <Tex math="+z" />, with the front, <Tex math="q = 0" /></p>
					<p>sideways velocity <Tex math={`${texNumber(tests.along.velocity)}`} /></p>
					<p><Tex math={`\\Delta E/E = ${texNumber(tests.along.gain)}`} /></p>
				</div>
			</div>
			<div class="test">
				<svg class="glyph" viewBox="0 0 {GLYPH} {GLYPH}" aria-hidden="true">
					<circle class="glyph-frame" cx={GLYPH / 2} cy={GLYPH / 2} r={GLYPH / 2 - 1} />
					<path class="glyph-shaft" d={photonArrow.shaft} />
					<path class="glyph-head" d={photonArrow.head} />
					<circle class="photon" cx={photonArrow.from[0]} cy={photonArrow.from[1]} r="3.4" />
				</svg>
				<div class="test-words">
					<p class="name">A photon along <Tex math="-z" />, against it, <Tex math="q = 2E/c" /></p>
					<p>turned by <Tex math={`|\\nabla H| = ${texNumber(tests.against.turn, 2)}`} /> rad</p>
					<p><Tex math={`\\Delta E/E = ${texNumber(tests.against.gain, 2)}`} /></p>
				</div>
			</div>
		</div>
	</section>

	<div class="bar">
		<div class="choices">
			<Segmented label="The profile" options={PROFILES} bind:value={profile} />
			<Segmented
				label="The sign of the profile"
				options={SIGNS}
				bind:value={signChoice.get, signChoice.set}
			/>
		</div>
		<div class="sliders">
			<Slider
				id="{uid}-strength"
				label="The strength"
				icon={FlashIcon}
				min={STRENGTH.min}
				max={STRENGTH.max}
				step={STRENGTH.step}
				bind:value={() => strength, setStrength}
				readout="largest |∇H| on the body, {strengthText}"
				ends={['10⁻⁴', '10⁻²']}
			/>
			<Slider
				id="{uid}-rapidity"
				label="The body’s rapidity"
				icon={Rocket01Icon}
				min={RAPIDITY.min}
				max={RAPIDITY.max}
				step={RAPIDITY.step}
				bind:value={() => rapidity, setRapidity}
				readout="{signed(rapidity)}, q/mc = {ratioText}"
				ends={['with the front', 'against it']}
				mark={{ at: 0, label: 'at rest' }}
			/>
			{#if profile === 'pair'}
				<Slider
					id="{uid}-xi"
					label="The ripple’s |ξ|"
					icon={WaveIcon}
					min={XI.min}
					max={XI.max}
					step={XI.step}
					bind:value={() => xi, setXi}
					readout="{xi.toFixed(2)}/R"
					ends={['0.5/R', '6/R']}
				/>
				<Slider
					id="{uid}-turn"
					label="The direction of ξ"
					icon={Compass01Icon}
					min={TURN.min}
					max={TURN.max}
					step={TURN.step}
					bind:value={() => turn, setTurn}
					readout="{turn}° from x"
				/>
			{/if}
		</div>
		<p class="hint">
			{#if profile === 'as'}
				Drag the crossing point <i>b</i>, or press anywhere in the plane to move it there; it stays
				outside the body. With the keyboard, Tab to it: the arrow keys move it by 0.05 <i>R</i>,
				with Shift by 0.25
				<i>R</i>.
			{:else}
				Choose Aichelburg and Sexl’s profile to drag the point where a particle without mass crosses
				the front.
			{/if}
		</p>
	</div>

	<p class="note">
		Exact: each particle’s kick <Tex math="\tfrac12q\nabla H" /> and its energy from the paper’s equation
		for <Tex math="\Delta E" /> in its Appendix C, summed over the 200 particles; the sum <Tex
			math="\tfrac14\sum_a cq_a|\nabla H(\boldsymbol x_a)|^2"
		/> beside it; the rest masses from the particles’ momenta, with <Tex math="Q = \sum_a q_a" /> and
		the variance weighted by <Tex math="q_a/Q" />; the contours of each profile, at equal steps.
		Schematic: the body is 200 points of seeded places and masses, which drift sideways at about
		{stirText} <i>c</i>, each with <Tex math="q = mc" /> at rapidity 0, so that the first term of the
		paper’s equation shows; the strength sets the largest <Tex math="|\nabla H|" /> on the body, whatever
		the source; the arrows are drawn at the key’s scale, far longer than any true kick, and ten times
		shorter once the body runs fast against the front; and the test particles’ arrows have a scale of
		their own, a photon’s sideways velocity <Tex math="c|\nabla H|" /> drawn at one length.
	</p>
</div>

<style>
	.impulsive-front {
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
		grid-template-columns: minmax(0, 11fr) minmax(0, 9fr);
	}

	.panel + .panel {
		border-left: 1px solid var(--line);
	}

	.stage {
		height: 100%;
		box-sizing: border-box;
		padding: 0.6rem 0.7rem 0.7rem;
		background: radial-gradient(circle at 50% 40%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
	}

	.heading {
		margin: 0 0 0.45rem;
		font-size: 0.8rem;
		font-weight: 500;
		line-height: 1.4;
		color: var(--text-dim);
		text-wrap: pretty;
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
		user-select: none;
		-webkit-user-select: none;
	}

	/* only a plane with a point to drag keeps the finger from scrolling the page */
	svg.movable {
		touch-action: none;
	}

	text {
		font-family: var(--font-sans);
		fill: var(--text-dim);
		pointer-events: none;
	}

	.it {
		font-family: KaTeX_Math, var(--font-serif);
		font-style: italic;
	}

	.view {
		fill: color-mix(in srgb, var(--text) 3%, transparent);
		stroke: var(--line);
		stroke-width: calc(1px * var(--u, 1));
	}

	/* the profile is the wave's: thin lines in the colour of the field */
	.contour {
		fill: none;
		stroke: color-mix(in srgb, var(--q-field) 55%, transparent);
		stroke-width: calc(0.9px * var(--u, 1));
		stroke-linecap: round;
	}

	.contour.below {
		stroke-dasharray: calc(2.5px * var(--u, 1)) calc(2.5px * var(--u, 1));
	}

	.axis {
		stroke-width: calc(1.4px * var(--u, 1));
		opacity: 0.75;
	}

	.axis.stretch {
		stroke: var(--accent);
	}

	.axis.squeeze {
		stroke: var(--accent-2);
	}

	.disc {
		fill: color-mix(in srgb, var(--q-matter) 9%, transparent);
		stroke: color-mix(in srgb, var(--q-matter) 55%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.origin {
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.particle {
		fill: color-mix(in srgb, var(--q-matter) 80%, var(--bg));
		stroke: var(--bg-sunken);
		stroke-width: calc(0.5px * var(--u, 1));
	}

	/* a kick is neither a mass nor a tide: the ink */
	.shaft {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.1px * var(--u, 1));
		stroke-linecap: round;
	}

	.head {
		fill: var(--text);
	}

	.shaft.newton {
		stroke-width: calc(1.3px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(2.2px * var(--u, 1));
		stroke-linecap: butt;
	}

	.nearest {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 55%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
	}

	.key-label {
		font-size: calc(10.5px * var(--u, 1));
		font-variant-numeric: tabular-nums;
		fill: var(--text-dim);
		paint-order: stroke;
		stroke: var(--bg-sunken);
		stroke-width: calc(3px * var(--u, 1));
		stroke-linejoin: round;
	}

	.shaft.key {
		stroke-width: calc(1.4px * var(--u, 1));
	}

	/* the particle without mass, in the colour of light */
	.crossing {
		fill: color-mix(in srgb, var(--q-light) 30%, var(--bg));
		stroke: var(--q-light);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.crossing-core {
		fill: var(--q-light);
	}

	.b-label {
		font: italic 500 calc(14px * var(--u, 1)) / 1 var(--font-serif);
		fill: var(--text);
		paint-order: stroke;
		stroke: var(--bg-sunken);
		stroke-width: calc(3px * var(--u, 1));
		stroke-linejoin: round;
	}

	.hit {
		fill: transparent;
		cursor: grab;
	}

	.hit.dragging {
		cursor: grabbing;
	}

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

	.where {
		margin: 0.45rem 0 0;
		font-size: 0.8rem;
		color: var(--text-dim);
		text-align: center;
	}

	/* --- the legend -------------------------------------------------------------------------- */

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem 1rem;
		margin: 0.4rem 0.2rem 0;
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
		border-top: 1.5px solid var(--text);
	}

	.particle-key {
		width: 0.45rem;
		height: 0.45rem;
		border: 0;
		border-radius: 50%;
		background: color-mix(in srgb, var(--q-matter) 80%, var(--bg));
	}

	.newton-key {
		border-top: 1.5px dashed var(--text);
	}

	.crossing-key {
		width: 0.6rem;
		height: 0.6rem;
		border: 1.2px solid var(--q-light);
		border-radius: 50%;
		background: radial-gradient(
			circle,
			var(--q-light) 0 25%,
			color-mix(in srgb, var(--q-light) 30%, var(--bg)) 30%
		);
	}

	.contour-key {
		border-top: 1px solid color-mix(in srgb, var(--q-field) 70%, transparent);
	}

	.stretch-key {
		border-top: 2px solid var(--accent);
	}

	.squeeze-key {
		margin-left: 0.45rem;
		border-top: 2px solid var(--accent-2);
	}

	/* --- the energies ------------------------------------------------------------------------ */

	.energies {
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
		padding: 0.6rem 0.9rem 0.8rem;
		font-size: 0.8rem;
		line-height: 1.4;
	}

	.energies .heading {
		margin: 0;
	}

	.bars {
		display: grid;
		gap: 0.6rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		grid-template-areas: 'label value' 'track track';
		gap: 0.15rem 0.6rem;
		align-items: baseline;
	}

	.label {
		grid-area: label;
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0 0.5rem;
		color: var(--text);
	}

	.words {
		font-size: 0.72rem;
		color: var(--text-dim);
	}

	.also {
		margin-left: 0.3em;
	}

	.value {
		grid-area: value;
		font-variant-numeric: tabular-nums;
		color: var(--q-matter);
		white-space: nowrap;
	}

	.track {
		grid-area: track;
		position: relative;
		height: 0.7rem;
		border-radius: 3px;
		background: color-mix(in srgb, var(--text) 6%, transparent);
	}

	.zero {
		position: absolute;
		top: -0.15rem;
		bottom: -0.15rem;
		width: 0;
		border-left: 1px solid color-mix(in srgb, var(--text) 55%, transparent);
	}

	.fill {
		position: absolute;
		top: 0;
		bottom: 0;
		border-radius: 2px;
		background: color-mix(in srgb, var(--q-matter) 75%, transparent);
		transition:
			left 140ms ease-out,
			width 140ms ease-out;
	}

	/* the integral over the front: the same energy, reached the other way, drawn hollow */
	.crossing .fill {
		background: color-mix(in srgb, var(--q-matter) 14%, transparent);
		box-shadow: inset 0 0 0 1.5px var(--q-matter);
	}

	.row.sum {
		padding-top: 0.55rem;
		border-top: 1px solid var(--line);
	}

	.mass {
		padding-top: 0.55rem;
		border-top: 1px solid var(--line);
	}

	.mass .heading {
		margin-bottom: 0.3rem;
	}

	dl {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 0.3rem 0.6rem;
		margin: 0;
		align-items: baseline;
	}

	dt {
		margin: 0;
	}

	dd {
		margin: 0;
		color: var(--q-matter);
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}

	.small {
		margin: auto 0 0;
		font-size: 0.74rem;
		color: var(--text-dim);
		text-wrap: pretty;
	}

	/* --- the test particles ------------------------------------------------------------------- */

	.strip {
		padding: 0.6rem 0.9rem 0.75rem;
		border-top: 1px solid var(--line);
	}

	.tests {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.6rem 1rem;
	}

	.test {
		display: flex;
		gap: 0.6rem;
		align-items: flex-start;
	}

	.glyph {
		flex: none;
		width: 3.4rem;
		height: 3.4rem;
	}

	.glyph-frame {
		fill: color-mix(in srgb, var(--text) 4%, transparent);
		stroke: var(--line);
	}

	.glyph-shaft {
		fill: none;
		stroke: var(--text);
		stroke-width: 1.4px;
		stroke-linecap: round;
	}

	.glyph-head {
		fill: var(--text);
	}

	.grain {
		fill: color-mix(in srgb, var(--q-matter) 80%, var(--bg));
		stroke: var(--q-matter);
	}

	.photon {
		fill: var(--q-light);
	}

	.photon-ring {
		fill: none;
		stroke: color-mix(in srgb, var(--q-light) 55%, transparent);
	}

	.test-words {
		min-width: 0;
		font-size: 0.76rem;
		line-height: 1.4;
		color: var(--text-dim);
	}

	.test-words p {
		margin: 0;
	}

	.test-words .name {
		color: var(--text);
		margin-bottom: 0.1rem;
	}

	/* --- the controls and the note ----------------------------------------------------------- */

	.bar {
		display: grid;
		gap: 0.7rem;
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.choices {
		display: grid;
		grid-template-columns: minmax(0, 3fr) minmax(0, 1.4fr);
		gap: 0.7rem 1.2rem;
	}

	.sliders {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.7rem 1.2rem;
	}

	.hint {
		margin: 0;
		font: 400 0.78rem/1.35 var(--font-sans);
		color: var(--text-dim);
		text-wrap: pretty;
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

	@media (prefers-reduced-motion: reduce) {
		.fill {
			transition: none;
		}
	}

	@media (max-width: 760px) {
		.tests {
			grid-template-columns: minmax(0, 1fr);
		}
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

		.choices,
		.sliders {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
