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
	<title>The sealed flywheel · The Gravitational Camera</title>
	<meta
		name="description"
		content="A smooth flywheel looks the same spinning or still, and weighs the same. The gravitomagnetic half of the camera sees it turn."
	/>
</svelte:head>

<RoomDemo {scene} subjectDistance={3.8} startDivider={0.5} look={{ yaw: 6, pitch: -12 }} subtract>
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
		<Tex display math={'\\mathbf{J}(\\hat n) = \\int \\rho\\,\\mathbf{v}\; \\frac{dr}{r} .'} />
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
			blurred. The arrows are shown magnified; their spread is that blur.
		</p>
	{/snippet}
</RoomDemo>
