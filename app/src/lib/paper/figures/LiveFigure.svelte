<script lang="ts">
	/**
	 * A demo scene running live inside the paper: light on one side, one of the
	 * gravitational views on the other, with a divider the reader can drag.
	 */
	import { resolve } from '$app/paths';
	import {
		MODE_NEAR,
		MODE_THERMAL,
		MODE_WAVES,
		analyzeScene,
		nearFieldBlur,
		packWaves,
		rotors,
		type Scene,
		type View
	} from '../../engine';
	import SplitView from '../../ui/SplitView.svelte';

	interface Props {
		scene: Scene;
		gravity: 'near' | 'thermal' | 'waves';
		/** Direction of view, degrees. */
		look: { yaw: number; pitch: number; fov?: number };
		divider?: number;
		/** Leave the empty room out of the gravity view. */
		subtract?: boolean;
		/** The demo page to send the reader to. */
		demo: 'locked-safe' | 'closed-furnace' | 'which-way';
		poster?: string;
	}

	let { scene, gravity, look, divider = 0.5, subtract = false, demo, poster }: Props = $props();

	const DEG = Math.PI / 180;
	// svelte-ignore state_referenced_locally
	let view: View = $state({
		yaw: look.yaw * DEG,
		pitch: look.pitch * DEG,
		fov: (look.fov ?? 52) * DEG
	});
	// svelte-ignore state_referenced_locally
	let split = $state(divider);

	const objects = $derived(analyzeScene(scene));
	const observer = $derived(scene.observer.position);
	// the demos' defaults: SNR 10^20 for the near field; light slowed to 20 cm/s and a 1.5 m array for waves
	const waves = $derived(
		gravity === 'waves'
			? packWaves(rotors(objects), observer, { c: 0.2, aperture: 1.5 })
			: undefined
	);
	const labels = {
		near: 'Gravity · near field',
		thermal: 'Gravity · thermal',
		waves: 'Gravity · waves · light slowed to 20 cm/s'
	};
</script>

<div class="live">
	<SplitView
		{objects}
		{observer}
		sunDirection={[0, 1, 0]}
		bind:view
		bind:divider={split}
		leftMode={0}
		rightMode={gravity === 'near' ? MODE_NEAR : gravity === 'thermal' ? MODE_THERMAL : MODE_WAVES}
		exposure={gravity === 'near' ? 2.2 : 1.6}
		nearBlur={nearFieldBlur(20) / 2.355}
		exclusion={scene.observer.exclusion ?? 0.25}
		room
		outline
		subtractRoom={subtract}
		{waves}
		rightLabel={labels[gravity]}
		embedded
		{poster}
	/>
</div>
<p class="hint">
	Live figure: drag to look around, or drag the divider. <a href={resolve(`/demo/${demo}`)}
		>Open the full demo</a
	> for every control.
</p>

<style>
	.live {
		aspect-ratio: 16 / 9;
		border-radius: 6px;
		overflow: hidden;
	}

	.hint {
		margin: 0.5rem 0 0;
		font: 400 0.76rem/1.4 var(--font-sans);
		color: var(--text-faint);
	}
</style>
