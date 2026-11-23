<script lang="ts">
	import {
		PlayIcon,
		RotateLeft01Icon,
		RotateRight01Icon,
		RulerIcon
	} from '@hugeicons/core-free-icons';
	import DemoShell from '#lib/ui/DemoShell.svelte';
	import Group from '#lib/ui/controls/Group.svelte';
	import Segmented from '#lib/ui/controls/Segmented.svelte';
	import Slider from '#lib/ui/controls/Slider.svelte';
	import Toggle from '#lib/ui/controls/Toggle.svelte';
	import Tex from '#lib/ui/Tex.svelte';
	import HiddenFlowDrawing from '#lib/paper/figures/hair/HiddenFlowDrawing.svelte';
	import { BALANCED, angularMomentum, bracket } from '#lib/hair/flow.js';

	let inner = $state(BALANCED);
	let way = $state<'ccw' | 'cw'>('ccw');
	let playing = $state(true);
	const sense = $derived(way === 'ccw' ? 1 : -1);

	const momentum = $derived(angularMomentum(inner, sense));
	const second = $derived(bracket(2, inner, sense));
	const third = $derived(bracket(3, inner, sense));

	/** A number as LaTeX to three places, with no negative zero. */
	function tex(x: number): string {
		const digits = Math.abs(x).toFixed(3);
		return x < 0 && Number(digits) !== 0 ? `-${digits}` : digits;
	}

	function reset() {
		inner = BALANCED;
		way = 'ccw';
		playing = true;
	}
</script>

<svelte:head>
	<title>A hidden flow · Gravitational Camera</title>
	<meta
		name="description"
		content="A sphere whose inner ball turns one way and the rest the other, with no angular momentum and no field outside to show it. Two tides of degree three, applied in either order, read the flow."
	/>
</svelte:head>

<DemoShell section="figures" title="A hidden flow" onreset={reset}>
	{#snippet stage()}
		<HiddenFlowDrawing {inner} {sense} {playing} />
	{/snippet}

	{#snippet controls()}
		<Group title="The sphere">
			<Slider
				id="inner"
				label="Radius of the inner ball"
				icon={RulerIcon}
				min={0.5}
				max={0.98}
				step={0.001}
				bind:value={inner}
				readout="{inner.toFixed(3)} R"
				ends={['half', 'nearly all']}
				mark={{ at: BALANCED, label: 'no angular momentum' }}
			/>
			<Segmented
				label="The way the inner ball turns"
				options={[
					{ value: 'ccw', label: 'Inner ball anticlockwise', icon: RotateLeft01Icon, wide: true },
					{ value: 'cw', label: 'Inner ball clockwise', icon: RotateRight01Icon, wide: true }
				]}
				bind:value={way}
			/>
			<Toggle icon={PlayIcon} label="Turning" bind:checked={playing} />
		</Group>
	{/snippet}

	{#snippet plain()}
		<h4>A ball that turns two ways at once</h4>
		<p>
			The picture shows a solid ball made of the same material all through. It has been cut through
			its middle, and you look at the cut from above, straight down the line that the ball turns
			about. That line is called the <strong>axis</strong>. It is the dot at the centre.
		</p>
		<p>
			The ball is in two parts. The <strong>inner ball</strong>, coloured orange, turns one way. The
			<strong>outer layer</strong>, coloured blue, turns the other way, at the same rate. Each arrow
			shows how far one small piece of the ball moves in a short time. Pieces far from the axis move
			faster, so their arrows are longer.
		</p>
		<h4>Why nothing shows outside</h4>
		<p>
			A turning body carries <strong>angular momentum</strong>. This is a measure of how much
			turning the body holds. It is larger when the body is heavier, when it turns faster, and when
			its mass lies farther from the axis. Here the inner ball and the outer layer carry angular
			momentum in opposite directions.
		</p>
		<p>
			The boundary between the two parts is placed at 0.87 of the ball’s radius. (The exact number
			is 2 raised to the power −1/5.) At this boundary the two amounts of angular momentum are
			exactly equal, so they cancel, and the ball as a whole has none.
		</p>
		<p>
			The gravity of the ball, measured outside it, shows its mass. With more care it also shows its
			angular momentum. It shows nothing else of the motion inside. If the ball held electric
			charge, spread evenly through it, its magnetic field outside would also be set by its angular
			momentum, and so that field would be zero too. Anything that only measures the field outside
			sees a ball at rest. The flow is <strong>hidden</strong>.
		</p>
		<h4>Two tides, in either order</h4>
		<p>
			A <strong>tide</strong> is a pull that is different on different parts of a body, so that it stretches
			or squeezes the body instead of moving it as one piece. A tide can be applied for a short moment,
			as a kick.
		</p>
		<p>
			The measurement goes like this. Give the ball a kick with one pattern of tide, wait a short
			time, and measure how its shape has changed, using a second pattern. Then do the same again
			with the two patterns swapped. If nothing moves inside the ball, the two answers are the same.
			If the inside flows, they differ. The difference is called the <strong>bracket</strong> of the two
			patterns, and it measures the flow.
		</p>
		<h4>The two plots</h4>
		<p>
			The plots on the right show where in the ball the bracket comes from, distance by distance
			from the centre, for two choices of the pair of patterns. In each plot the orange area is the
			part that the inner ball gives, which counts with one sign. The blue area is the part that the
			outer layer gives, which counts with the other sign. The number at the right is the total.
		</p>
		<ul>
			<li>
				<strong>Degree two</strong> is the simplest pair of patterns, a stretch and a squeeze. Its bracket
				is just the angular momentum, doubled and with its sign reversed. With the boundary at 0.87 the
				two areas are equal, the total is zero, and these tides see nothing.
			</li>
			<li>
				<strong>Degree three</strong> is the next pair, with finer patterns. Its share grows faster with
				distance from the centre, so the outer layer counts for more. The total is 0.221, in units of
				the ball’s mass times its rate of turning times the fourth power of its radius. The hidden flow
				is found.
			</li>
		</ul>
		<p>
			Move the boundary with the slider. Away from 0.87 of the radius the ball has some angular
			momentum, and the total for degree two is no longer zero. At 0.87 it vanishes, but the total
			for degree three stays.
		</p>
	{/snippet}

	{#snippet help()}
		<p>
			The pieces of the ball turn by themselves while <em>Turning</em> is on. Turn it off to hold them
			still. If your system asks for reduced motion, they stay still and the arrows alone show which way
			each part turns.
		</p>
		<p>
			Under Controls, the slider moves the boundary between the inner ball and the outer layer. The
			mark under it is the boundary at which the ball has no angular momentum. The second control
			swaps the way the two parts turn: every total then changes its sign.
		</p>
	{/snippet}

	{#snippet notes()}
		<p>
			A uniform sphere of mass <Tex math="M" /> and radius <Tex math="R" /> in section through its equator,
			seen along its axis. The inner ball, out to <Tex math="r_0" />, turns one way at the rate <Tex
				math="\Omega"
			/> and the rest the other way at the same rate. At
			<Tex math={'r_0 = 2^{-1/5}R'} /> it has no angular momentum, and so no magnetic field outside if
			it is charged uniformly; its field outside is that of a sphere at rest.
		</p>
		<p>
			The plots are the share of each radius in the bracket of Eq. (flow-bracket), for the pairs of
			profiles <Tex math="h + ig = (x + iy)^n/n" /> with <Tex math="n = 2" /> and <Tex math="3" />,
			each drawn to its own greatest value. The inner ball counts with one sign and the rest with
			the other, in proportion to <Tex math={'r^{2n}'} />.
		</p>
		<dl>
			<div>
				<dt>Angular momentum, in units of <Tex math="M\Omega R^2" /></dt>
				<dd><Tex math={`L_z = ${tex(momentum)}`} /></dd>
			</div>
			<div>
				<dt>Bracket, degree two, in units of <Tex math="M\Omega R^2" /></dt>
				<dd><Tex math={`\\{\\dot Q_h, \\dot Q_g\\}_2 = ${tex(second)} = -2L_z`} /></dd>
			</div>
			<div>
				<dt>Bracket, degree three, in units of <Tex math="M\Omega R^4" /></dt>
				<dd><Tex math={`\\{\\dot Q_h, \\dot Q_g\\}_3 = ${tex(third)}`} /></dd>
			</div>
			<div>
				<dt>Magnetic field outside, if charged uniformly</dt>
				<dd>
					{Math.abs(momentum) < 5e-4
						? 'none: the halves’ moments cancel'
						: 'a dipole, in proportion to the angular momentum'}
				</dd>
			</div>
		</dl>
		<p class="fine">
			Each arrow is the path of a part in one interval of time, so the arrows lengthen with the
			distance from the axis. Each plot is drawn to its own greatest value; the totals are in units
			of <Tex math={'M\\Omega R^{2n-2}'} />, positive when the inner ball turns anticlockwise as
			seen.
		</p>
		<p class="fine">
			In a trapped gas the same bracket, divided by the sum rule, is the splitting of the quadrupole
			modes by a vortex (Zambelli and Stringari, 1998).
		</p>
	{/snippet}

	{#snippet physics()}
		<h4>The bracket of two rates</h4>
		<p>
			The rates of change of two moments <Tex math={'Q_h = \\int\\rho\\,h\\,\\mathrm{d}V'} /> and
			<Tex math="Q_g" />, with <Tex math="h" /> and <Tex math="g" /> harmonic, have the bracket
		</p>
		<Tex
			display
			math={'\\{\\dot Q_h, \\dot Q_g\\} = \\int\\mathbf J\\cdot\\bigl[(\\nabla\\nabla h)\\,\\nabla g - (\\nabla\\nabla g)\\,\\nabla h\\bigr]\\,\\mathrm{d}V ,'}
		/>
		<p>
			with <Tex math="\mathbf J" /> the density of momentum. It is the part of the response that changes
			sign when the profile applied and the moment read are exchanged: to second order in a short time
			<Tex math="\tau" />, the change of <Tex math="Q_h" /> per unit of a weak impulse of profile <Tex
				math="g"
			/>, less the change of <Tex math="Q_g" /> per unit of one of profile
			<Tex math="h" />, is <Tex math={'\\tau^2\\{\\dot Q_h, \\dot Q_g\\}'} />.
		</p>
		<h4>The sphere</h4>
		<p>
			For <Tex math="h + ig = w^n/n" />, <Tex math="w = x + iy" />, and the flow
			<Tex math={'\\mathbf J = \\rho\\,\\omega(r)\\,\\hat{\\mathbf z}\\times\\mathbf x'} />, the
			bracket is
			<Tex math={'-2(n-1)\\int\\rho\\,\\omega\\,\\varpi^{2n-2}\\,\\mathrm{d}V'} />, with
			<Tex math="\varpi" /> the distance from the axis. For <Tex math="n = 2" /> that is
			<Tex math="-2L_z" />, which vanishes at <Tex math={'r_0 = 2^{-1/5}R'} />. For <Tex
				math="n = 3"
			/>,
		</p>
		<Tex
			display
			math={'\\{\\dot Q_h, \\dot Q_g\\} = \\tfrac{32}{35}\\bigl(1 - 2(r_0/R)^7\\bigr)\\,M\\Omega R^4 = \\tfrac{32}{35}\\bigl(1 - 2^{-2/5}\\bigr)\\,M\\Omega R^4 = 0.221\\,M\\Omega R^4 ,'}
		/>
		<p>
			and it changes sign with the sense of the turning. For the pair of plane-wave profiles of the
			Calderón problem the bracket is
			<Tex
				math={'-\\tfrac12|\\boldsymbol\\xi|^2\\,\\boldsymbol\\eta\\cdot\\tilde{\\mathbf J}(\\boldsymbol\\xi)'}
			/>, so the flows that have no magnetic field outside are read from outside as the density is.
		</p>
	{/snippet}
</DemoShell>
