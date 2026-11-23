<script lang="ts">
	import { LayerIcon, RulerIcon } from '@hugeicons/core-free-icons';
	import DemoShell from '#lib/ui/DemoShell.svelte';
	import Group from '#lib/ui/controls/Group.svelte';
	import Slider from '#lib/ui/controls/Slider.svelte';
	import Tex from '#lib/ui/Tex.svelte';
	import HoleResponseDrawing from '#lib/paper/figures/hair/HoleResponseDrawing.svelte';
	import {
		HOLE_RADII,
		PAPER_RADII,
		SHARP_LIMIT,
		least,
		moments,
		positivity
	} from '#lib/hair/hole.js';

	const lowest = least();
	const rounded = least(moments(PAPER_RADII));
	const START = Math.round(100 * lowest.a) / 100;

	let degree = $state(2);
	let a = $state(START);

	const radius = $derived(HOLE_RADII[degree]);
	const value = $derived(positivity(a));

	/** A number as LaTeX, to so many places, with no negative zero. */
	function tex(x: number, places = 2): string {
		const digits = Math.abs(x).toFixed(places);
		return x < 0 && Number(digits) !== 0 ? `-${digits}` : digits;
	}

	function reset() {
		degree = 2;
		a = START;
	}
</script>

<svelte:head>
	<title>A black hole’s response · Gravitational Camera</title>
	<meta
		name="description"
		content="A black hole's response to tides of each degree, weighed and written as a shell of its own mass. Each shell alone could be a body; three together fail a test that every positive mass passes."
	/>
</svelte:head>

<DemoShell section="figures" title="A black hole’s response" onreset={reset}>
	{#snippet stage()}
		<HoleResponseDrawing bind:degree bind:a />
	{/snippet}

	{#snippet controls()}
		<Group title="The tide">
			<Slider
				id="degree"
				label="Degree of the tide"
				icon={LayerIcon}
				min={2}
				max={8}
				step={1}
				bind:value={degree}
				readout="ℓ = {degree}"
				ends={['quadrupole', 'degree eight']}
			/>
		</Group>
		<Group title="The test">
			<Slider
				id="a"
				label="The number a"
				icon={RulerIcon}
				min={0}
				max={9}
				step={0.01}
				bind:value={a}
				readout="a = {a.toFixed(2)} rₛ²"
				mark={{ at: lowest.a, label: 'the least' }}
			/>
		</Group>
	{/snippet}

	{#snippet plain()}
		<h4>What the picture shows</h4>
		<p>
			The dark disc is a black hole, shown as a flat cut through its middle. Its edge is the
			<strong>horizon</strong>, the surface from which nothing, not even light, can come back out.
			The radius of the horizon is called the <strong>Schwarzschild radius</strong> and is written
			<i>r</i><sub>s</sub>. Every length in this figure is measured in units of <i>r</i><sub>s</sub
			>.
		</p>
		<h4>Weighing a reply</h4>
		<p>
			A <strong>tide</strong> is a pull that is different on different parts of a body, so that it
			stretches and squeezes the body. Tides come in kinds, numbered by their
			<strong>degree</strong>, written ℓ. Degree 2 is the simplest stretch and squeeze, the kind
			that a distant mass makes. Higher degrees are finer and finer patterns of stretching and
			squeezing.
		</p>
		<p>
			Imagine pushing a body with tides of one degree that change at every possible rate, from very
			slow to very fast. At each rate, measure how strongly the body responds, and add all of these
			up. (Each rate is counted with a particular weighting, which the theory fixes.) The paper
			calls this total the <strong>weight of the response</strong> to that degree of tide.
		</p>
		<p>
			For an ordinary round body, this weight depends only on how far from its centre the mass lies.
			Mass far from the centre gives a large weight, and mass near the centre gives a small one. So
			the weight can be described by one distance: the radius of a thin hollow shell, with the same
			total mass, that would give the same weight.
		</p>
		<h4>The hole’s shells</h4>
		<p>
			The same weight can be worked out for a black hole, from how much of each passing wave the
			hole swallows. For the simplest tide, of degree 2, the hole replies like a shell at 1.02 times
			its Schwarzschild radius, just outside its horizon. For degree 3 the shell is at 1.46 times
			that radius, and for degree 4 it is at 1.61. As the degree grows, the radius creeps up toward
			1.91.
		</p>
		<p>
			The orange rings in the picture are these shells. The bold ring belongs to the degree you have
			chosen. The chart at the top right shows the same radii, one point for each degree.
		</p>
		<h4>A test that no real body fails</h4>
		<p>
			Each of these shells, taken on its own, could be a real body. But a real body has only one
			arrangement of its mass, and that one arrangement must give all of the weights at once. This
			puts rules on the weights.
		</p>
		<p>
			Here is one rule. Choose any number <i>a</i>. For every small piece of the body, take its mass
			and multiply it by <i>r</i>²(<i>r</i>² − <i>a</i>)², where <i>r</i> is the piece’s distance from
			the centre. Then add up the results over the whole body. Each result is a mass times a square, so
			it cannot be negative, and so the sum cannot be negative either. The sum can be worked out from
			the weights for degrees 2, 3 and 4 alone, without knowing anything else about the body.
		</p>
		<p>
			The lower chart shows this sum worked out from the black hole’s weights, for each value of
			<i>a</i>. For most values it is positive. But near <i>a</i> = 4.34 it falls below zero, to
			−2.04, in units of the hole’s mass times the sixth power of <i>r</i><sub>s</sub>. The shaded
			band is where no body made of ordinary, positive mass can ever be.
		</p>
		<p>
			So <strong
				>no arrangement of ordinary matter, of any shape, replies to tides as a black hole does</strong
			>. One kind of tide lets you picture the hole as a shell of matter. Three kinds together allow
			no picture at all.
		</p>
	{/snippet}

	{#snippet help()}
		<p>
			To choose the degree of the tide, press one of the orange rings round the hole or one of the
			points on the upper chart, or use the first slider under Controls.
		</p>
		<p>
			To move the number <i>a</i> of the test, press or drag anywhere along the lower chart, or use
			the second slider. The value of the sum at that <i>a</i> is written at the top of the chart; it
			turns red when it falls below zero. When the marker on the curve is selected, the arrow keys move
			it in small steps, and with Shift held down in larger ones.
		</p>
	{/snippet}

	{#snippet notes()}
		<p>
			For a round body the sum over frequency of its response to a tide of degree
			<Tex math="\ell" /> is <Tex
				math={'[\\ell(2\\ell+1)/4\\pi]\\int\\rho\\,r^{2\\ell-2}\\,\\mathrm{d}V'}
			/>. The hole’s sums, found from the fraction of each wave it absorbs, are drawn as the radius
			<Tex math="R_\ell" /> of the thin shell of the hole’s mass that has the same sum,
			<Tex math={'\\int\\rho\\,r^{2\\ell-2}\\,\\mathrm{d}V = MR_\\ell^{2\\ell-2}'} />. They tend to
			<Tex math="(3\sqrt3/e)\,r_s" />.
		</p>
		<p>
			For any distribution of positive mass <Tex
				math={'\\int\\rho\\,r^2(r^2 - a)^2\\,\\mathrm{d}V \\ge 0'}
			/>. With the hole’s sums for <Tex math="\ell = 2, 3, 4" /> it is
			<Tex math="M(R_4^6 - 2aR_3^4 + a^2R_2^2)" />, drawn in the lower chart.
		</p>
		<dl>
			<div>
				<dt>The shell for degree {degree}, and the moment it stands for</dt>
				<dd>
					<Tex
						math={`R_{${degree}} = ${radius.toFixed(3)}\\,r_s, \\quad \\int\\rho\\,r^{${2 * degree - 2}}\\,\\mathrm{d}V = ${(radius ** (2 * degree - 2)).toFixed(degree > 4 ? 1 : 3)}\\,Mr_s^{${2 * degree - 2}}`}
					/>
				</dd>
			</div>
			<div>
				<dt>The test at this <Tex math="a" />, in units of <Tex math="Mr_s^6" /></dt>
				<dd>
					<Tex math={`${tex(value)} \\ \\text{at}\\ a = ${a.toFixed(2)}\\,r_s^2`} />
					{value < 0 ? ', which no positive mass gives' : ''}
				</dd>
			</div>
			<div>
				<dt>Its least value</dt>
				<dd>
					<Tex
						math={`${tex(lowest.value)}\\,Mr_s^6 \\ \\text{at}\\ a = ${lowest.a.toFixed(2)}\\,r_s^2`}
					/>
				</dd>
			</div>
		</dl>
		<p class="fine">
			The radii are the reference implementation’s, to four places and more: the paper prints two,
			and rounded so they move <Tex math="R_4^6" /> enough that the least would read
			<Tex math={tex(rounded.value, 1)} /> at <Tex math={rounded.a.toFixed(2)} />, below zero all
			the same. The dashed circle and line are the limit <Tex
				math={'(3\\sqrt3/e)\\,r_s = ' + SHARP_LIMIT.toFixed(2) + '\\,r_s'}
			/>.
		</p>
	{/snippet}

	{#snippet physics()}
		<h4>The weight of the response</h4>
		<p>
			For ordinary matter the sum rule <Tex
				math={'(2/\\pi)\\int\\omega\\,\\mathrm{Im}\\,\\chi\\,\\mathrm{d}\\omega'}
			/>
			is the inertia that a tide has to move: for a round body under a quadrupolar tide,
			<Tex math={'\\tfrac13\\int\\rho\\,r^2\\,\\mathrm{d}V'} />. A hole’s dissipative response is
			fixed by the fraction <Tex math="\Gamma_2" /> of a quadrupole wave it absorbs, and with
			<Tex math="x = GM\omega/c^3" />
		</p>
		<Tex
			display
			math={'\\frac{2}{\\pi}\\int_0^\\infty\\omega\\,\\mathrm{Im}\\,\\chi\\,\\mathrm{d}\\omega = \\frac{5}{32\\pi}\\,Mr_s^2\\int_0^\\infty\\frac{\\Gamma_2}{x^4}\\,\\mathrm{d}x = 0.345\\,Mr_s^2 ,'}
		/>
		<p>
			the sum of a shell of the hole’s mass at <Tex math="1.02\,r_s" />. The tide of degree
			<Tex math="\ell" /> gives <Tex math={'\\int\\rho\\,r^{2\\ell-2}\\,\\mathrm{d}V'} /> for a round
			body, and the sequence fixes the density at every radius.
		</p>
		<h4>Why no body has these sums</h4>
		<p>
			Write <Tex math={'m_k = \\int\\rho\\,r^{2k}\\,\\mathrm{d}V/M = R_{k+1}^{2k}'} />. For positive
			mass
		</p>
		<Tex
			display
			math={'\\int\\rho\\,r^{2}(r^2 - a)^2\\,\\mathrm{d}V = M\\,(m_3 - 2a\\,m_2 + a^2 m_1) \\ge 0'}
		/>
		<p>
			for every <Tex math="a" />, which is the Cauchy–Schwarz inequality
			<Tex math="m_2^2 \le m_1 m_3" />. With the hole’s radii it is least at
			<Tex math="a = m_2/m_1 = 4.34\,r_s^2" />, where it is <Tex math="-2.04\,Mr_s^6" />. The
			moments in frequency of the response to one tide are those of a positive measure; it is the
			sums across the degrees that belong to no body. Any absorber that takes all that comes within
			a fixed radius fails in the same way.
		</p>
	{/snippet}
</DemoShell>
