<script lang="ts">
	/**
	 * The "One pixel" layer of a room demo: what a single pixel at the camera reads (lib/pixel/probe.ts), drawn as
	 * the sky around it seen as the camera sees it (the centre is where the camera looks): its four stars, its type
	 * and the motion alarm.
	 */
	import { cameraBasis, type View } from '../engine/camera';
	import type { AnalyzedObject, Vec3 } from '../engine/types';
	import { describe, readingAt } from '../pixel/probe';

	interface Props {
		objects: AnalyzedObject[];
		observer: Vec3;
		view: View;
	}

	let { objects, observer, view }: Props = $props();

	const R = 52;
	const d = $derived(describe(readingAt(objects, observer)));
	const basis = $derived(cameraBasis(view));
	const dots = $derived(
		d.stars.map((s) => {
			const x = s[0] * basis.right[0] + s[1] * basis.right[1] + s[2] * basis.right[2];
			const y = s[0] * basis.up[0] + s[1] * basis.up[1] + s[2] * basis.up[2];
			const z = s[0] * basis.forward[0] + s[1] * basis.forward[1] + s[2] * basis.forward[2];
			return { x: x * R, y: -y * R, front: z > 0 };
		})
	);
	const words: Record<string, string> = {
		D: 'type D: like one round body',
		I: 'type I: not one round body',
		N: 'type N: a wave',
		II: 'type II',
		III: 'type III',
		O: 'no field'
	};
	const lit = $derived(d.alarm > 1e-12);
</script>

<aside class="probe" aria-label="What one pixel at the camera reads">
	<svg
		viewBox="-60 -60 120 120"
		role="img"
		aria-label="Its four stars on the sky, seen as the camera sees it"
	>
		<circle r={R} class="disc" />
		<line x1="-6" x2="6" class="mark" />
		<line y1="-6" y2="6" class="mark" />
		{#each dots as p, i (i)}
			<circle cx={p.x} cy={p.y} r="4.4" class={['star', { behind: !p.front }]} />
		{/each}
	</svg>
	<div>
		<p class="head">One pixel, at the camera</p>
		<p>{words[d.type] ?? d.type}</p>
		<p class={lit ? 'alarm' : 'still'}>
			{lit ? `something moves: ${d.alarm.toExponential(0)}` : 'all still'}
		</p>
	</div>
</aside>

<style>
	.probe {
		position: absolute;
		right: 1rem;
		bottom: 1rem;
		display: flex;
		align-items: center;
		gap: 0.6rem;
		width: 15.5rem;
		padding: 0.45rem 0.8rem 0.45rem 0.45rem;
		border-radius: 14px;
		background: rgb(12 15 21 / 0.84);
		border: 1px solid rgb(255 255 255 / 0.08);
		backdrop-filter: blur(14px);
		color: #e9e6df;
		font: 500 0.72rem/1.3 var(--font-sans);
		pointer-events: none;
	}
	p {
		margin: 0.15rem 0;
	}
	.head {
		font-weight: 600;
		letter-spacing: 0.02em;
	}
	svg {
		width: 4.6rem;
		flex: none;
		height: auto;
	}
	.disc {
		fill: rgb(255 255 255 / 0.05);
		stroke: rgb(255 255 255 / 0.3);
	}
	.mark {
		stroke: rgb(255 255 255 / 0.25);
	}
	.star {
		fill: #e8a45a;
		stroke: #07090d;
		stroke-width: 1;
	}
	.star.behind {
		opacity: 0.35;
	}
	.still {
		color: #7bd88f;
	}
	.alarm {
		color: #ff9c8a;
	}
</style>
