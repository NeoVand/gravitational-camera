<script lang="ts">
	/**
	 * The "One pixel" layer of a room demo: what a single pixel at the camera reads (lib/pixel/probe.ts), drawn as
	 * the sky around it seen as the camera sees it (the centre is where the camera looks): its four principal null
	 * directions, its type and the test for motion. In brief it is one line, for the foot of the sidebar.
	 */
	import { cameraBasis, type View } from '../engine/camera';
	import type { AnalyzedObject, Vec3 } from '../engine/types';
	import { describe, readingAt } from '../pixel/probe';
	import Tex from './Tex.svelte';

	interface Props {
		objects: AnalyzedObject[];
		observer: Vec3;
		view: View;
		/** One line of words only. */
		brief?: boolean;
	}

	let { objects, observer, view, brief = false }: Props = $props();

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
	/** The test for motion as LaTeX, to one figure: three times ten to the minus five, or ten to the minus five. */
	const alarm = $derived.by(() => {
		const [m, e] = d.alarm.toExponential(0).split('e');
		const power = `10^{${Number(e)}}`;
		return m === '1' ? power : `${m} \\times ${power}`;
	});
</script>

{#if brief}
	<p class="line">
		<strong>One pixel, at the camera:</strong>
		{words[d.type] ?? d.type};
		<span class={lit ? 'alarm' : 'still'}
			>{#if lit}something moves: <Tex math={alarm} />{:else}all still{/if}</span
		>.
	</p>
{:else}
	<div class="probe">
		<svg
			viewBox="-60 -60 120 120"
			role="img"
			aria-label="Its four principal null directions on the sky, seen as the camera sees it"
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
				{#if lit}something moves: <Tex math={alarm} />{:else}all still{/if}
			</p>
		</div>
	</div>
	<p class="what">
		The disc is the sky about the pixel, as the camera sees it: its centre is where the camera
		looks. The dots are the reading’s four principal null directions, a faint one behind you; how
		they fall together gives its type. The last line tests for motion: the reading’s eigenvalues are
		real when nothing in the scene moves, however the pixel moves, and complex when something does.
	</p>
{/if}

<style>
	.probe {
		display: flex;
		align-items: center;
		gap: 0.9rem;
		color: var(--text);
		font: 500 0.8rem/1.35 var(--font-sans);
	}

	.line {
		margin: 0;
	}

	.line strong {
		font-weight: 600;
		color: var(--text);
	}

	.what {
		margin: 1rem 0 0;
		font-size: 0.78rem;
		line-height: 1.5;
		color: var(--text-faint);
	}
	p {
		margin: 0.15rem 0;
	}
	.head {
		font-weight: 600;
		letter-spacing: 0.02em;
	}
	svg {
		width: 7rem;
		flex: none;
		height: auto;
	}

	/* on a phone the panel is a short sheet: a smaller disc, and the words closer under it */
	@media (max-width: 720px) {
		svg {
			width: 5.2rem;
		}

		.what {
			margin-top: 0.6rem;
		}
	}
	.disc {
		fill: color-mix(in srgb, var(--text) 5%, transparent);
		stroke: var(--line-strong);
	}
	.mark {
		stroke: var(--line-strong);
	}
	.star {
		fill: var(--accent);
		/* a ring of the panel's ground keeps touching dots apart */
		stroke: var(--bg-sunken);
		stroke-width: 1;
	}
	.star.behind {
		opacity: 0.35;
	}
	.still {
		color: var(--good);
	}

	.alarm {
		color: var(--bad);
	}
</style>
