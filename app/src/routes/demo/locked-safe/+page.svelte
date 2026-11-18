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
	startDivider={0.6}
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
