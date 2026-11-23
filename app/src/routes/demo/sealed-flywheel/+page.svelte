<script lang="ts">
	import sceneJson from '../../../../../scenes/sealed-flywheel.scene.json';
	import type { Scene } from '#lib/engine/index.js';
	import RoomDemo from '#lib/ui/RoomDemo.svelte';
	import Tex from '#lib/ui/Tex.svelte';

	const scene = sceneJson as unknown as Scene;
	// the right-hand flywheel: a steel ball 35 cm in radius at 50 turns a second
	const rimSpeed = 2 * Math.PI * 50 * 0.35;
	const ratio = rimSpeed / 299_792_458;
</script>

<svelte:head>
	<title>The sealed flywheel · Gravitational Camera</title>
	<meta
		name="description"
		content="A smooth flywheel looks the same spinning or still, and weighs the same. The gravitomagnetic half of the camera sees it turn."
	/>
</svelte:head>

<RoomDemo
	{scene}
	subjectDistance={3.8}
	look={{ yaw: 6, pitch: -12 }}
	subtract
	subject={{ id: 'flywheel-right', name: 'one flywheel' }}
>
	{#snippet intro()}
		<p>
			Two sealed steel housings each hold a smooth steel flywheel. The right-hand one turns at 3000
			revolutions a minute; the other is still. In <strong>light</strong> they are identical, and since
			a smooth wheel spinning has the same shape as one at rest, so is their pull: the near-field image
			shows two equal blurs.
		</p>
		<p>
			But each pixel records two tensors, not one. The second, the gravitomagnetic field, is made by
			moving mass, and shows the <strong>flow</strong> inside the housing: a vortex, turning the way the
			wheel turns.
		</p>
	{/snippet}
	{#snippet physicsExtra()}
		<h4>What the second tensor sees</h4>
		<p>
			Each pixel records the magnetic part of the field, <Tex math={'\\mathcal{B}_{ij}'} />, as well
			as <Tex math={'\\mathcal{E}_{ij}'} />. It is sourced by the momentum density <Tex
				math={'\\rho\\mathbf{v}'}
			/>, and a moving element at distance <Tex math="r" /> contributes in proportion to <Tex
				math={'1/r^3'}
			/>, just as a mass element does. So the same argument images the <em>current column</em>
		</p>
		<Tex display math={'\\mathbf{J}(\\hat n) = \\int \\rho\\,\\mathbf{v}\\; \\frac{dr}{r} .'} />
		<p>
			For a ball turning at angular velocity <Tex math={'\\boldsymbol\\omega'} /> about a point <Tex
				math={'\\mathbf{s}'}
			/>,
		</p>
		<Tex
			display
			math={'\\mathbf{J} = \\rho \\left[ (\\boldsymbol\\omega \\times \\hat n)(b - a) - (\\boldsymbol\\omega \\times \\mathbf{s}) \\ln \\frac{b}{a} \\right],'}
		/>
		<p>
			where the line of sight enters and leaves at <Tex math="a" /> and <Tex math="b" />. Seen along
			its axis the wheel makes a vortex; a still one makes nothing.
		</p>
		<h4>How faint</h4>
		<p>
			The ratio of the two signals is the speed of the matter over that of light. The rim moves at
			<Tex math={`${rimSpeed.toFixed(0)}\\,\\mathrm{m/s}`} />, so the flow is <Tex
				math={`v/c \\approx ${(ratio * 1e7).toFixed(1)} \\times 10^{-7}`}
			/> of the mass image: a camera reaching <Tex math={'\\mathrm{SNR} = 10^{20}'} /> on the mass sees
			the flow at about <Tex math={`10^{${(20 + Math.log10(ratio)).toFixed(1)}}`} />, and so more
			blurred. The flow image is drawn at its own brightness, magnified against the mass image; its
			spread is that blur. Its hue is the direction in which mass moves across the view (the wheel
			in the corner), so a turning body shows as a ring of hues going round.
		</p>
	{/snippet}
	{#snippet plain()}
		<p>
			Two sealed steel boxes stand 3.6 metres from the camera. Each holds a smooth steel flywheel, a
			ball 70 centimetres across. The right-hand wheel turns fifty times a second. The left-hand
			wheel is still. In light the two boxes look the same.
		</p>
		<p>
			The picture is split by a vertical line. To the left, marked <em>Light</em>, is what an
			ordinary camera sees. To the right, marked <em>Gravity · near field and flow</em>, is what an
			imagined <strong>gravitational camera</strong> would show. Each pixel of this camera measures how
			the pull of gravity changes from one point to the next. On the gravity side, the dark blue to white
			glow shows mass along each line of sight. The pull of the empty room has been taken away to begin
			with.
		</p>
		<p>
			A smooth wheel has the same shape whether it turns or not, so it pulls in the same way. The
			mass picture therefore shows two equal blurs. But moving mass also produces a second kind of
			gravitational effect, much as a moving electric charge produces magnetism. This effect is
			called the <strong>magnetic part</strong> of the field. Each pixel measures it as well. It
			shows the <strong>flow</strong> of mass inside the right-hand box as a ring of colours. The colours
			go round the ring in the direction in which the wheel turns. Each colour says which way the mass
			moves across the view, as the colour wheel in a corner of the picture shows.
		</p>
		<p>Try these first. Open the Controls tab.</p>
		<ul>
			<li>
				Turn the <em>Flow</em> switch off and on. With it off, the two boxes look the same to gravity
				too.
			</li>
			<li>
				Move the <em>Sensitivity</em> slider to the left. The <strong>sensitivity</strong> is the size
				of the signal divided by the size of the random noise in the readings. The flow blurs away first,
				because its signal is much weaker.
			</li>
		</ul>
		<p>
			The flow is drawn far brighter than it really is. Its true strength is the speed of the rim
			divided by the speed of light. The rim moves at 110 metres a second, so the flow is about four
			ten-millionths of the mass signal. Section X of the paper, “What the camera can do that light
			cannot”, lists this among the camera's abilities: it can see mass flowing inside a sealed
			body.
		</p>
	{/snippet}
	{#snippet help()}
		<p>
			Drag the picture to look around, and scroll to zoom. Drag the vertical dividing line to show
			more light or more gravity.
		</p>
		<p>
			In the Controls tab, <em>Image</em> shows the gravity picture, <em>Tidal field</em> shows how
			gravity stretches and squeezes space at points around the camera, and <em>One exposure</em>
			adds the noise of one set of readings. <em>Sensitivity</em> sets how far the signal stands
			above the noise, and <em>Exposure</em> brightens or darkens the gravity side. Under Layers,
			<em>Flow</em>
			shows or hides the colours of moving mass, and <em>Room</em> adds or removes the pull of the floor
			and walls. The other switches show or hide each part of the picture. Reset puts the view back.
		</p>
	{/snippet}
</RoomDemo>
