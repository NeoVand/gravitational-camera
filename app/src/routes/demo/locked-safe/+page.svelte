<script lang="ts">
	import sceneJson from '../../../../../scenes/locked-safe.scene.json';
	import type { Scene } from '#lib/engine/index.js';
	import { Analytics01Icon } from '@hugeicons/core-free-icons';
	import { SafeCamera } from '#lib/array/workbench.svelte.js';
	import CameraAtWork from '#lib/ui/CameraAtWork.svelte';
	import CameraAtWorkControls from '#lib/ui/CameraAtWorkControls.svelte';
	import RoomDemo from '#lib/ui/RoomDemo.svelte';

	const scene = sceneJson as unknown as Scene;
	/** The array, its noise and its latest exposure: shared by the view and its controls. */
	const camera = new SafeCamera();
</script>

<svelte:head>
	<title>The locked safe · Gravitational Camera</title>
	<meta
		name="description"
		content="Two identical steel safes, one holding gold. Ordinary light cannot tell them apart; the gravitational camera can."
	/>
</svelte:head>

<RoomDemo
	{scene}
	subjectDistance={3.5}
	work={{
		label: 'The camera at work',
		icon: Analytics01Icon,
		stage: workStage,
		controls: workControls,
		notes: workNotes
	}}
>
	{#snippet intro()}
		<p>
			Two steel safes stand in a room. The right-hand one holds 324 kg of gold; the other is empty.
			In
			<strong>light</strong> they are identical. In <strong>gravity</strong> no wall can hide the gold:
			mass has only one sign, so no wall, however thick, shields what is behind it.
		</p>
		<p>
			What limits the camera is blur and the sameness of different arrangements of the same mass,
			not walls. Lower the sensitivity and the gold dissolves into the safe around it.
		</p>
	{/snippet}
	{#snippet plain()}
		<p>
			Two steel safes stand in a room, 3.5 metres from the camera. The right-hand safe holds a bar
			of gold of 324 kilograms on its floor. The left-hand safe is empty. The picture is split by a
			vertical line. To the left, marked <em>Light</em>, the room looks as it does to an ordinary
			camera, and the safes look the same. To the right, marked <em>Gravity · near field</em>, is
			what an imagined <strong>gravitational camera</strong> would show.
		</p>
		<p>
			This camera does not collect light. Each of its pixels measures how the pull of gravity
			changes from one point to the next. In this way it feels every mass nearby. On the gravity
			side, brightness shows mass. In each direction, the picture adds up the mass that lies along
			that line of sight. Nearer mass counts for more. Black means no mass. Dark blue, then teal,
			then white mean more and more mass. The floor and the walls show too, because they also have
			mass.
		</p>
		<p>
			Gravity passes through steel, so the walls of the safe cannot hide the gold. Nothing else can
			hide it either. An electric charge can be cancelled by an opposite charge placed beside it,
			but mass is never negative, so nothing can cancel the pull of the gold. The gold therefore
			shows as a bright patch low in the right-hand safe.
		</p>
		<p>Try these first. Open the Controls tab.</p>
		<ul>
			<li>
				Move the <em>Sensitivity</em> slider to the left. The <strong>sensitivity</strong> is the size
				of the signal divided by the size of the random noise in the camera's readings. The readout gives
				it as a power of ten. For example, 10²⁰ means that the signal is 10²⁰ times larger than the noise.
				The readout also gives the width of the blur in degrees. As the sensitivity falls, the blur grows
				and the gold dissolves into the safe around it.
			</li>
			<li>
				Under View, choose <em>The camera at work</em>. This replaces the picture with the real
				measurement. An array of 121 pixels, one metre across, takes readings that include noise.
				The page then computes from those readings alone which safe holds the gold, and how likely
				that answer is to be wrong. Try the buttons for a signal-to-noise ratio of 10 and of 34, and
				press <em>New exposure</em> a few times.
			</li>
		</ul>
		<p>
			What limits the camera is blur, not walls. Section IV of the paper, “The near field”, works
			through this safe. At a signal-to-noise ratio of 34 the camera picks the wrong safe only once
			in a thousand tries.
		</p>
	{/snippet}
	{#snippet help()}
		<p>
			Drag the picture to look around, and scroll to zoom. Drag the vertical dividing line to show
			more light or more gravity.
		</p>
		<p>
			In the Controls tab, <em>Image</em> shows the gravity picture, <em>Tidal field</em> shows how
			gravity stretches and squeezes space at points around the camera, and
			<em>The camera at work</em>
			shows the measurement and what is computed from it. <em>Sensitivity</em> sets how far the
			signal stands above the noise, and <em>Exposure</em> brightens the gravity side. The
			<em>Layers</em>
			switches show or hide each part of the picture. In <em>The camera at work</em>, the sliders
			set the signal-to-noise ratio and the size of the array, <em>Positivity</em> forbids negative
			mass, and <em>What is inside</em> changes the hidden contents.
		</p>
	{/snippet}
</RoomDemo>

{#snippet workStage()}
	<CameraAtWork {camera} />
{/snippet}

{#snippet workControls()}
	<CameraAtWorkControls {camera} />
{/snippet}

{#snippet workNotes()}
	<p>
		<strong>The camera at work</strong> is the measurement itself. An array of pixels at the camera reads
		the tidal tensor with noise. From those readings alone the page computes an image with its uncertainty,
		and a decision with its chance of error.
	</p>
	<p class="fine">
		Change the signal-to-noise ratio, the array, or what is in the safe, and take new exposures. The
		noise of an exposure depends only on its number, so the same exposure can be seen again with
		other contents. At a signal-to-noise ratio of 10 the decision is wrong about one time in five.
		At 1,000 the image still cannot weigh a safe to better than ±730 kg, until mass is required to
		be positive.
	</p>
	<p class="fine">
		The computation is the paper’s worked case (Section IV and Appendix A), a port of its reference
		implementation, on the same grid of 231 cells. With positivity on, the error is the spread over
		40 redraws of the noise about the camera’s own fit, since the camera does not have the true
		scene to redraw about.
	</p>
{/snippet}
