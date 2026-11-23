<script lang="ts">
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		CircleDotIcon,
		DiceIcon,
		HexagonIcon,
		Layers01Icon,
		OctagonIcon,
		RepeatIcon,
		SquareIcon,
		StarIcon,
		Target03Icon,
		VolumeHighIcon
	} from '@hugeicons/core-free-icons';
	import DemoShell from '#lib/ui/DemoShell.svelte';
	import PushAndWeigh from '#lib/ui/PushAndWeigh.svelte';
	import Group from '#lib/ui/controls/Group.svelte';
	import Segmented from '#lib/ui/controls/Segmented.svelte';
	import Slider from '#lib/ui/controls/Slider.svelte';
	import Tex from '#lib/ui/Tex.svelte';
	import {
		PAIRS,
		PARTICLES,
		TIDE_NAMES,
		exactEnergy,
		firstDegreeThatSeparates,
		placesFor,
		pushAndWeigh,
		type Degree,
		type PairName,
		type Weighing
	} from '#lib/hair/ladder.js';

	let chosen = $state<PairName>('second');
	let degree = $state<Degree>(3);
	let sigma = $state(0.02);
	let count = $state(10);
	/** The pushes made so far: each press of Push weighs again, with noise drawn from this number. */
	let trial = $state(1);
	let figure: PushAndWeigh | undefined = $state();

	const pair = $derived(PAIRS[chosen]);
	const gain = $derived({ a: exactEnergy(pair.a, degree), b: exactEnergy(pair.b, degree) });
	const weighed = $derived(pushAndWeigh(pair.a, pair.b, degree, sigma, count, trial));

	const lowest = $derived.by(() => {
		const l = firstDegreeThatSeparates(pair.a, pair.b);
		if (l === undefined) return 'none found';
		const name = TIDE_NAMES[l as Degree];
		return name && !name.startsWith('degree') ? `the ${name}, degree ${l}` : `degree ${l}`;
	});
	const said = $derived.by(() => {
		if (weighed.error === 0)
			return weighed.apart
				? 'tell the two apart: with no noise, any difference does'
				: 'do not tell the two apart: with no noise, they agree';
		const apart = `${weighed.sigmas.toFixed(1)} standard errors`;
		return weighed.apart
			? `tell the two apart: ${apart}`
			: `do not tell the two apart: ${apart}, fewer than three`;
	});

	/** A mean and its standard error, as LaTeX. */
	function read(w: Weighing): string {
		const places = placesFor(w.error);
		return `${w.mean.toFixed(places)} \\pm ${w.error.toFixed(places)}`;
	}

	function reset() {
		chosen = 'second';
		degree = 3;
		sigma = 0.02;
		count = 10;
		trial = 1;
	}
</script>

<svelte:head>
	<title>Push and weigh · Gravitational Camera</title>
	<meta
		name="description"
		content="Two round bodies with the same mass and the same field outside. A tide applied as an impulse, and a weighing afterwards, tell them apart, if the tide is of high enough degree."
	/>
</svelte:head>

<DemoShell section="figures" title="Push and weigh" onreset={reset}>
	{#snippet stage()}
		<PushAndWeigh
			bind:this={figure}
			a={pair.a}
			b={pair.b}
			{degree}
			{weighed}
			onpush={() => (trial += 1)}
		/>
	{/snippet}

	{#snippet controls()}
		<Group title="The two bodies">
			<Segmented
				label="The pair of bodies"
				options={[
					{ value: 'point', label: PAIRS.point.label, icon: CircleDotIcon },
					{ value: 'second', label: PAIRS.second.label, icon: Layers01Icon, wide: true },
					{ value: 'fourth', label: PAIRS.fourth.label, icon: Target03Icon, wide: true }
				]}
				bind:value={chosen}
			/>
		</Group>
		<Group title="The tide">
			<Segmented
				label="The degree of the tide"
				options={[
					{ value: '2', label: 'Quadrupole', icon: SquareIcon },
					{ value: '3', label: 'Octupole', icon: HexagonIcon },
					{ value: '4', label: 'Hexadecapole', icon: OctagonIcon },
					{ value: '5', label: 'Degree five', icon: StarIcon }
				]}
				bind:value={() => String(degree), (v) => (degree = Number(v) as Degree)}
			/>
		</Group>
		<Group title="The weighing">
			<Slider
				id="noise"
				label="Noise"
				icon={VolumeHighIcon}
				min={0}
				max={0.05}
				step={0.0005}
				bind:value={sigma}
				readout={sigma ? `σ = ${sigma.toFixed(4)}` : 'none'}
				ends={['none', 'much']}
			/>
			<Slider
				id="pushes"
				label="Pushes"
				icon={RepeatIcon}
				min={1}
				max={100}
				step={1}
				bind:value={count}
				readout="N = {count}"
				ends={['one', 'a hundred']}
			/>
			<div class="actions">
				<button type="button" class="action" onclick={() => figure?.push()}>
					<HugeiconsIcon icon={DiceIcon} size={16} strokeWidth={1.8} /> Push
				</button>
			</div>
		</Group>
	{/snippet}

	{#snippet plain()}
		<p>
			Two round bodies, A and B, are drawn cut through their centres. Each is made of thin shells of
			mass, drawn as circles. Some also have a point of mass at the centre. The dots are small
			pieces of the shells. The two bodies have the same mass. By Newton's <strong
				>shell theorem</strong
			>, a round body pulls on everything outside it as if all its mass were at its centre. So A and
			B pull in exactly the same way. A reading of their gravity at one time gives their mass and
			nothing more.
		</p>
		<p>
			A tide can tell them apart. A <strong>tide</strong> is a pull that is stronger in some places than
			in others. The coloured lobes round each body show one: it pushes outward where the lobes are orange
			and inward where they are blue. Here the tide acts for an instant, so it gives every piece of the
			body a small kick. The short lines on the dots are those kicks. The body gains energy of motion.
			By Einstein's E = mc², energy has mass. So the body becomes a little heavier, and weighing it measures
			the energy gained.
		</p>
		<p>
			Under each body, the bar is the exact energy gained, and the mark is the energy found by
			weighing, with its error. The table on the right, called the ladder, lists what each kind of
			tide gives A and B, and whether the two are the same or different.
		</p>
		<p>
			Tides come in degrees. A tide of degree two, the <strong>quadrupole</strong>, has four lobes.
			Degree three, the <strong>octupole</strong>, has six. Each higher degree has two more lobes.
			Each also reaches one step deeper into how the mass is spread between the centre and the
			surface.
		</p>
		<p>Try these first. Open the Controls tab.</p>
		<ul>
			<li>
				At the start, the mass of each body lies, on average, equally far from its centre. More
				exactly, the average of the squared distance is the same. Press <em>Push</em>, in the
				Controls tab under <em>The weighing</em>. The octupole tells them apart.
			</li>
			<li>
				Choose <em>Quadrupole</em>, and push again. Now they gain the same energy, and they are not
				told apart.
			</li>
			<li>
				Raise the <em>Noise</em> slider and lower <em>Pushes</em>. With fewer, noisier weighings,
				the difference can be lost.
			</li>
		</ul>
		<p>
			Section XIII of the paper, “Newton's theorem at second order”, shows that such tides can
			reveal the whole inside of a body.
		</p>
	{/snippet}

	{#snippet help()}
		<p>
			Press <em>Push</em>, in the Controls tab under <em>The weighing</em>, to push both bodies and
			weigh them again.
		</p>
		<p>
			In the Controls tab, the first choice picks the pair of bodies: <em>A point and a shell</em>,
			<em>Same second moment</em>, or <em>Same second and fourth moments</em>. The next choice picks
			the degree of the tide, from <em>Quadrupole</em> to <em>Degree five</em>. The <em>Noise</em>
			slider sets the error of each weighing. The <em>Pushes</em> slider sets how many times each
			body is pushed and weighed. Each press of <em>Push</em> repeats the weighings with new noise. Reset
			returns the page to how it started.
		</p>
	{/snippet}

	{#snippet notes()}
		<p>
			Two round bodies, A and B, cut through their centres. Each is made of thin shells, some with a
			point at the centre; the dots are particles of the shells. The two have the same mass and, by
			the shell theorem, the same field outside. A reading of that field at one time gives the mass
			and nothing more, so it cannot tell them apart.
		</p>
		<p>
			A tide applied from outside as an impulse, and a weighing afterwards, give more. An impulse of
			profile <Tex math="g" />, a harmonic polynomial, and strength <Tex math="\epsilon" /> gives every
			part of the body the velocity <Tex math="\epsilon\nabla g" /> where it stands. The lobes round each
			body are the tide, outward in orange and inward in blue. A body at rest gains the energy
		</p>
		<Tex
			display
			math={'\\Delta E = \\frac{\\epsilon^2}{2}\\int\\rho\\,|\\nabla g|^2\\,\\mathrm{d}V ,'}
		/>
		<p>
			and energy has weight. Press <em>Push</em>: each body is pushed <Tex math="N" /> times and weighed
			after each push, every weighing with noise <Tex math="\sigma" />.
		</p>
		<p>
			How much of the inside is reached depends on the degree of the tide. For a round body a tide
			of degree <Tex math="l" /> reads the single number
			<Tex math={'M\\langle r^{2l-2}\\rangle'} />. So there are pairs of bodies with the same field
			outside that no tide of degree <Tex math="l" /> tells apart and a tide of degree
			<Tex math="l + 1" /> does: the three pairs here, for the quadrupole, the octupole and the hexadecapole.
		</p>
		<dl>
			<div>
				<dt>Energy gained from one push, exact: A · B</dt>
				<dd><Tex math={`${gain.a.toFixed(5)} \\cdot ${gain.b.toFixed(5)}`} /></dd>
			</div>
			<div>
				<dt>A weighed, {count === 1 ? 'after one push' : `the mean of ${count} pushes`}</dt>
				<dd><Tex math={read(weighed.a)} /></dd>
			</div>
			<div>
				<dt>B weighed, {count === 1 ? 'after one push' : `the mean of ${count} pushes`}</dt>
				<dd><Tex math={read(weighed.b)} /></dd>
			</div>
			<div>
				<dt>The weighings</dt>
				<dd>{said}</dd>
			</div>
			<div>
				<dt>The lowest tide that tells this pair apart</dt>
				<dd>{lowest}</dd>
			</div>
		</dl>
		<p class="fine">
			The figure is exact for these bodies, and the particles are a sampling of each shell,
			{PARTICLES.toLocaleString('en-GB')} on each, whose energies are summed for the simulated value.
			Energies and the noise are in units of <Tex math={'\\epsilon^2 M R^{2l-2}'} />. The two are
			called told apart when their means differ by more than three standard errors of the
			difference.
		</p>
		<p class="fine">
			The same structure is known in impedance tomography, for currents and potentials at the
			surface of a ball (Garde and Hirvensalo, 2025).
		</p>
	{/snippet}

	{#snippet physics()}
		<h4>The tides drawn</h4>
		<p>
			The tide of degree <Tex math="l" /> here is
			<Tex math={'g_l = \\mathrm{Re}\\,(x + iy)^l / l'} />, a harmonic polynomial with
			<Tex math="2l" /> lobes about one axis; the quadrupole is <Tex math="(x^2 - y^2)/2" />. The
			velocity it gives has the square
			<Tex math={'\\epsilon^2 (x^2 + y^2)^{l-1}'} />, whose mean over a sphere of radius
			<Tex math="r" /> is <Tex math={'\\epsilon^2 c_l\\, r^{2l-2}'} />, with
		</p>
		<Tex
			display
			math={'c_l = \\langle \\sin^{2l-2}\\theta \\rangle = \\frac{(2l-2)!!}{(2l-1)!!} ,'}
		/>
		<p>
			that is <Tex math={'\\tfrac{2}{3}'} />, <Tex math={'\\tfrac{8}{15}'} />,
			<Tex math={'\\tfrac{16}{35}'} /> and <Tex math={'\\tfrac{128}{315}'} /> for
			<Tex math="l" /> from 2 to 5. A body of thin shells, of masses <Tex math="m_s" /> and radii
			<Tex math="r_s" />, gains
		</p>
		<Tex display math={'\\Delta E_l = \\frac{\\epsilon^2}{2}\\, c_l \\sum_s m_s\\, r_s^{2l-2} .'} />
		<h4>What a tide of a given degree reaches</h4>
		<p>
			Tides of degree up to <Tex math="m" /> reach, in every angular sector, exactly the radial moments
		</p>
		<Tex display math={'\\int \\rho\\, r^{L+2j}\\, Y_{LM}\\, \\mathrm{d}V , \\qquad j < m ,'} />
		<p>
			and no more; a reading at one time has only <Tex math="j = 0" />. In the second pair both
			bodies have <Tex math={'\\langle r^{2} \\rangle = R^{2}/2'} />; in the third,
			<Tex math={'\\langle r^{2} \\rangle = R^{2}/2'} /> and
			<Tex math={'\\langle r^{4} \\rangle = 5R^{4}/16'} />. So the quadrupole reads the second pair
			alike, and the quadrupole and the octupole the third.
		</p>
	{/snippet}
</DemoShell>
