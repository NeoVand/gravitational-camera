<script lang="ts">
	import { RulerIcon } from '@hugeicons/core-free-icons';
	import DemoShell from '#lib/ui/DemoShell.svelte';
	import Group from '#lib/ui/controls/Group.svelte';
	import Slider from '#lib/ui/controls/Slider.svelte';
	import Tex from '#lib/ui/Tex.svelte';
	import PassingDrawing from '#lib/paper/figures/hair/PassingDrawing.svelte';
	import {
		FARTHEST,
		NEAREST,
		PAPER_PASS,
		TWINS,
		farDifference,
		internalF,
		steelBall
	} from '#lib/hair/passing.js';

	let b = $state(PAPER_PASS);

	const ea = $derived(internalF(TWINS.a, b));
	const eb = $derived(internalF(TWINS.b, b));
	/** The paper's example, a steel ball of radius 0.5 m, with the pass at b in units of its radius. */
	const steel = $derived(steelBall(0.5 * b));

	/** A small positive number as LaTeX, to two figures: 4.5 \times 10^{-33}. */
	function sci(x: number): string {
		const [mantissa, exponent] = x.toExponential(1).split('e');
		return `${mantissa} \\times 10^{${Number(exponent)}}`;
	}
	const places = (x: number) => (x < 0.01 ? 5 : 3);

	function reset() {
		b = PAPER_PASS;
	}
</script>

<svelte:head>
	<title>A mass that passes · Gravitational Camera</title>
	<meta
		name="description"
		content="Two round bodies with the same field outside, and a mass that flies past them. The energy the pass leaves inside each is different, and the passing mass loses it from its own motion: one pass tells the two apart."
	/>
</svelte:head>

<DemoShell section="figures" title="A mass that passes" onreset={reset}>
	{#snippet stage()}
		<PassingDrawing bind:b />
	{/snippet}

	{#snippet controls()}
		<Group title="The pass">
			<Slider
				id="b"
				label="Distance of the pass"
				icon={RulerIcon}
				min={NEAREST}
				max={FARTHEST}
				step={0.01}
				bind:value={b}
				readout="b = {b.toFixed(2)} R"
				ends={['grazing', 'four radii']}
				mark={{ at: PAPER_PASS, label: 'the paper’s' }}
			/>
		</Group>
	{/snippet}

	{#snippet plain()}
		<h4>Two bodies that pull alike</h4>
		<p>
			The picture shows two round bodies, called <strong>A</strong> and <strong>B</strong>, cut in
			half so that you can see inside them. Body A is a single thin, hollow shell. Body B has half
			of its mass packed into a small lump at its centre. The other half of B’s mass is spread over
			a larger hollow shell. The two bodies have the same total mass.
		</p>
		<p>
			Outside them, the two bodies pull on other things in exactly the same way. This is
			<strong>Newton’s shell theorem</strong>: a round body pulls on anything outside it as if all
			of its mass sat at its centre. So no measurement of the pull outside, however careful, can
			tell A from B.
		</p>
		<h4>A mass flies past</h4>
		<p>
			Now a small mass flies past each body in a straight line, very fast. In the picture you look
			straight along its path, so the whole path appears as one point: the small bead. The distance
			from the centre of the body to the path is called <strong><i>b</i></strong>. It is measured in
			units of <i>R</i>, the radius of B’s outer shell.
		</p>
		<p>
			As the mass goes by, it pulls on every part of the body. The parts nearest to its path are
			pulled hardest. The mass is fast, so the pull lasts only a moment. Each part therefore
			receives a short <strong>kick</strong>, which is a small, sudden change in its speed.
		</p>
		<p>
			The whole body is also pulled a little toward the path, as one piece. The arrows show what is
			left after this shared motion is taken away: how each part moves compared with the body as a
			whole. An <strong>orange</strong> arrow points away from the centre. A
			<strong>blue</strong> arrow points toward the centre. The lump at the centre of B moves exactly
			with the body as a whole, so it has no arrow.
		</p>
		<h4>The energy left inside</h4>
		<p>
			Because the parts are kicked differently, they move against each other. The body is left with
			some <strong>internal energy</strong>: energy of motion inside it, which later turns into
			vibration and heat. The bars show this energy for A and for B.
		</p>
		<p>
			At the paper’s distance, <i>b</i> = 1.5 <i>R</i>, body B is left with about 30% more energy
			than body A. So <strong>one pass tells the two bodies apart</strong>, although their pull
			outside is identical.
		</p>
		<p>
			The reason is that the kicks differ most from part to part far from the centre. Body B keeps
			half of its mass far out, at the full radius <i>R</i>. Body A keeps all of its mass at a
			middle distance. The two bodies were chosen so that a certain average of the squared distance
			of their mass from the centre is the same. The simplest kind of tide, the stretch and squeeze
			made by a distant mass, sees only that average, so it cannot tell them apart. A close pass
			sees more than that average.
		</p>
		<h4>How the passing mass tells</h4>
		<p>
			The energy left in the body is taken from the passing mass’s own energy of motion. So the
			passing mass leaves a little slower than it came. Its loss of speed, measured on many paths
			that miss the body, would reveal how the mass inside the body is arranged. Nothing has to be
			weighed.
		</p>
		<h4>The chart</h4>
		<p>
			The chart shows the internal energy against the distance <i>b</i>, for both bodies. Both
			curves fall quickly as the pass moves away. The difference between them falls even faster: far
			away it shrinks with the sixth power of the distance, so doubling <i>b</i> makes it 64 times smaller.
		</p>
		<h4>How small it is</h4>
		<p>
			The effect is far too small to measure. In the paper’s example, a mass of one tonne passes one
			metre from the edge of a steel ball one metre across, at 44 kilometres per second. It loses
			about five parts in 10<sup>33</sup> of its speed. Most of that loss is the pull on the ball as
			a whole. The part that depends on the inside of the ball is about two parts in 10<sup>34</sup
			>.
		</p>
	{/snippet}

	{#snippet help()}
		<p>
			Drag the bead, the small ball with a dot at its middle, to the left or the right. You can also
			press anywhere along its track. This changes the distance of the pass. The two beads move
			together, because the same pass is applied to both bodies.
		</p>
		<p>
			You can also press or drag across the chart, or use the slider under Controls. When the bead
			is selected, the arrow keys move it in small steps, and with Shift held down in larger ones.
		</p>
	{/snippet}

	{#snippet notes()}
		<p>
			Two round bodies with the same mass and the same field outside: A, a thin shell of radius
			<Tex math="R/\sqrt2" />, and B, half of its mass at the centre and half on a shell of radius
			<Tex math="R" />. Both have <Tex math={'\\int\\rho\\,r^2\\,\\mathrm{d}V = MR^2/2'} />. They
			are seen along the straight path of a mass <Tex math="\mu" /> that flies past them at the speed
			<Tex math="V" />, crossing the page at the bead, a distance <Tex math="b" /> from their centres.
		</p>
		<p>
			In the impulse approximation each part receives the velocity
			<Tex math="C(\mathbf b - \mathbf s)/|\mathbf b - \mathbf s|^2" />, with
			<Tex math="C = 2G\mu/V" /> and <Tex math="\mathbf s" /> where it lies across the path. The arrows
			are those velocities less the body’s recoil, <Tex math="C\mathbf b/b^2" />; the bars and the
			chart are the energy left inside, all the body gains less
			<Tex math="MC^2/2b^2" />.
		</p>
		<dl>
			<div>
				<dt>Energy left inside A · B, in units of <Tex math="MC^2/2R^2" /></dt>
				<dd><Tex math={`${ea.toFixed(places(ea))} \\cdot ${eb.toFixed(places(eb))}`} /></dd>
			</div>
			<div>
				<dt>B over A</dt>
				<dd><Tex math={`${(eb / ea).toFixed(3)}`} /></dd>
			</div>
			<div>
				<dt>
					B less A · the far-away estimate <Tex math="MC^2R^4/15b^6" />, in the same units
				</dt>
				<dd>
					<Tex math={`${sci(eb - ea)} \\cdot ${sci(farDifference(b))}`} />
				</dd>
			</div>
			<div>
				<dt>
					The paper’s example at this pass: a tonne at 44 km/s and a steel ball of radius 0.5 m,
					passed at {(0.5 * b).toFixed(2)} m from its centre. Its loss of speed, in all · left inside
				</dt>
				<dd>
					<Tex math={`\\Delta V/V = ${sci(steel.totalLoss)} \\cdot ${sci(steel.internalLoss)}`} />
				</dd>
			</div>
		</dl>
		<p class="fine">
			The arrows stand on sixteen places round each shell, with the part they belong to at their
			middles; their directions are exact, and their lengths are in proportion to the velocities for
			small ones and drawn shorter for large ones, so that they stay in the picture. The bars are
			drawn to the larger of the two energies. The paper’s figure has <Tex math="b = 1.5R" />; its
			example of the steel ball has <Tex math="b = 3R" />, a metre from the ball’s edge.
		</p>
		<p class="fine">
			This is the heating of a star cluster by a passing star, in the impulse approximation of
			stellar dynamics (Spitzer 1958).
		</p>
	{/snippet}

	{#snippet physics()}
		<h4>The pass as a tide</h4>
		<p>
			A mass that flies past fast enough that the parts of the body do not move meanwhile gives each
			part the impulse of the tide of profile <Tex math="-\ln|\mathbf s - \mathbf b|" />, which is
			harmonic in a body that the path misses. A body at rest gains
		</p>
		<Tex
			display
			math={'\\Delta E(\\mathbf b) = \\frac{C^2}{2}\\int\\frac{\\Sigma(\\mathbf s)}{|\\mathbf b - \\mathbf s|^2}\\,\\mathrm{d}^2s ,'}
		/>
		<p>
			with <Tex math="\Sigma" /> its mass per area projected along the path, and the passing mass leaves
			slower by <Tex math="\Delta E/\mu V" />. Nothing is weighed, and the speed of light does not
			enter.
		</p>
		<h4>A round body</h4>
		<p>For a thin shell of mass <Tex math="m" /> and radius <Tex math="r < b" /> the integral is</p>
		<Tex
			display
			math={'\\int\\frac{\\Sigma}{|\\mathbf b - \\mathbf s|^2}\\,\\mathrm{d}^2s = \\frac{m\\,\\arcsin(r/b)}{r\\sqrt{b^2 - r^2}} ,'}
		/>
		<p>and for any round body, as a series,</p>
		<Tex
			display
			math={'\\frac{M}{b^2} + \\frac{2}{3}\\,\\frac{\\int\\rho\\,r^2\\,\\mathrm{d}V}{b^4} + \\frac{8}{15}\\,\\frac{\\int\\rho\\,r^4\\,\\mathrm{d}V}{b^6} + \\dots ,'}
		/>
		<p>
			of which the first term is the recoil of the whole body. The two bodies here share the first
			two terms. Their fourth moments are <Tex math="MR^4/4" /> and <Tex math="MR^4/2" />, so far
			away they differ by <Tex math="MC^2R^4/15b^6" />; at <Tex math="b = 1.5R" /> the internal energies
			are <Tex math="0.080" /> and <Tex math="0.104\,MC^2/2R^2" />, a difference of 30%.
		</p>
		<h4>What the passes give</h4>
		<p>
			The losses on the paths that miss the body give every moment of <Tex math="\Sigma" />, and
			paths in the directions of one great circle give the density. The deflection of the passing
			mass is of first order in <Tex math="\mu" /> and holds only the moments of
			<Tex math="\Sigma" /> against the powers of <Tex math="x + iy" />: it is the shell theorem in
			the plane.
		</p>
	{/snippet}
</DemoShell>
