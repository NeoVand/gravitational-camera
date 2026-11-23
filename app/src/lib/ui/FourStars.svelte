<script lang="ts">
	/**
	 * Two skies around one point: the principal null directions of gravity's field there (four) and of light's (two), for the same
	 * sources (lib/pixel/scene.ts). Drag a source to move it; drag anywhere else to turn the sky.
	 */
	import { fitText } from './figure-text';
	import { norm, type Vec3 } from '../pixel/complex';
	import { greatCircle, project, toCamera, toWorld } from '../pixel/view';
	import {
		readGravity,
		readLight,
		sideways,
		type Source,
		type Star,
		type Wave
	} from '../pixel/scene';

	interface Props {
		sources: Source[];
		wave?: Wave;
		/** The view: turn about the vertical, then tilt (radians). */
		yaw: number;
		pitch: number;
		/** A source dragged to a new position. */
		onmove: (index: number, position: Vec3) => void;
	}

	let { sources, wave, yaw = $bindable(), pitch = $bindable(), onmove }: Props = $props();

	const U = 100; // drawing units per metre: the sky has radius 1
	// the two colours of the theme (light's is set in the style below); SVG's presentation attributes cannot take var()
	const GRAVITY = 'var(--accent)';
	const LIGHT = 'var(--c-light)';

	const gravity = $derived(readGravity(sources, wave));
	const light = $derived(readLight(sources, wave));

	const view = $derived({ yaw, pitch });
	const cam = (p: Vec3) => toCamera(view, p);
	const world = (q: Vec3) => toWorld(view, q);
	const at = (p: Vec3) => project(view, p, U);
	const circles = $derived([greatCircle(view, [0, 1, 0], U), greatCircle(view, [0, 0, 1], U)]);

	/** Touching dots for a star of multiplicity n, so that they can be counted. */
	function dots(star: Star): { x: number; y: number; z: number }[] {
		const c = at(star.direction);
		const r = 4.2;
		const offsets: [number, number][] =
			star.count === 4
				? [
						[-r, -r],
						[r, -r],
						[-r, r],
						[r, r]
					]
				: star.count === 3
					? [
							[-r, r * 0.6],
							[r, r * 0.6],
							[0, -r]
						]
					: star.count === 2
						? [
								[-r, 0],
								[r, 0]
							]
						: [[0, 0]];
		return offsets.map(([dx, dy]) => ({ x: c.x + dx, y: c.y + dy, z: c.z }));
	}

	const midLight = $derived.by(() => {
		if (sources.length !== 1 || wave || light.stars.length !== 2) return undefined;
		const [a, b] = light.stars.map((s) => s.direction);
		return [0, 1, 2].map((i) => 0.5 * (a[i] + b[i])) as Vec3;
	});

	const typeWords: Record<string, string> = {
		N: 'type N: one wave',
		D: 'type D: like one round body',
		I: 'type I: not one round body or one wave',
		II: 'type II',
		III: 'type III',
		O: 'no field'
	};

	// --- dragging: a source in the plane of the screen, or the sky itself ---------------------------------------------
	let drag:
		| { kind: 'source'; index: number; depth: number }
		| { kind: 'turn'; x: number; y: number; yaw: number; pitch: number }
		| undefined;

	function svgPoint(svg: SVGSVGElement, e: PointerEvent) {
		const m = svg.getScreenCTM();
		if (!m) return { x: 0, y: 0 };
		const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
		return { x: p.x, y: p.y };
	}

	function down(e: PointerEvent) {
		// a drag is not a click: nothing under it takes the focus, and no ring is drawn round it
		e.preventDefault();
		const svg = e.currentTarget as SVGSVGElement;
		const target = (e.target as Element).closest('[data-source]');
		svg.setPointerCapture(e.pointerId);
		if (target) {
			const index = Number(target.getAttribute('data-source'));
			drag = { kind: 'source', index, depth: cam(sources[index].position)[2] };
		} else {
			drag = { kind: 'turn', x: e.clientX, y: e.clientY, yaw, pitch };
		}
	}

	function move(e: PointerEvent) {
		if (!drag) return;
		if (drag.kind === 'turn') {
			yaw = drag.yaw + (e.clientX - drag.x) * 0.008;
			pitch = Math.max(-1.45, Math.min(1.45, drag.pitch + (e.clientY - drag.y) * 0.008));
			return;
		}
		const p = svgPoint(e.currentTarget as SVGSVGElement, e);
		let w = world([p.x / U, -p.y / U, drag.depth]);
		const r = norm(w);
		const clamped = Math.max(1.15, Math.min(1.8, r));
		w = w.map((x: number) => (x * clamped) / r) as Vec3;
		onmove(drag.index, w);
	}

	function up() {
		drag = undefined;
	}

	function arrowTo(from: { x: number; y: number }, to: { x: number; y: number }) {
		return `M${from.x.toFixed(1)},${from.y.toFixed(1)}L${to.x.toFixed(1)},${to.y.toFixed(1)}`;
	}
</script>

{#snippet sky(
	name: string,
	count: string,
	stars: Star[],
	colour: string,
	marker: string,
	mid: Vec3 | undefined,
	words: string
)}
	<svg
		viewBox="-190 -212 380 372"
		class="sky"
		role="img"
		aria-label="{name}: the principal null directions of the field on the sky around the pixel"
		onpointerdown={down}
		onpointermove={move}
		onpointerup={up}
		onpointercancel={up}
		{@attach fitText()}
	>
		<defs>
			<marker
				id="{marker}-head"
				viewBox="0 0 10 10"
				refX="9"
				refY="5"
				markerWidth="5"
				markerHeight="5"
				orient="auto-start-reverse"
			>
				<path d="M0,0L10,5L0,10z" style:fill={colour} />
			</marker>
			<marker
				id="{marker}-ink"
				viewBox="0 0 10 10"
				refX="9"
				refY="5"
				markerWidth="5"
				markerHeight="5"
				orient="auto-start-reverse"
			>
				<path d="M0,0L10,5L0,10z" class="ink" />
			</marker>
		</defs>
		<text class="title" x="0" y="-180" style:fill={colour}
			>{name} <tspan class="dim">· {count}</tspan></text
		>
		<!-- what lies behind the sky, faint, then the sky over it -->
		{#each circles as c, i (i)}
			<path d={c.back} class="back-line" />
		{/each}
		{#each stars as s, i (i)}
			{#each dots(s) as d, j (j)}
				{#if d.z < 0}<circle
						cx={d.x}
						cy={d.y}
						r="4"
						style:fill={colour}
						opacity="0.35"
						class="star behind"
					/>{/if}
			{/each}
		{/each}
		<circle r={U} class="sky-disc" />
		{#each circles as c, i (i)}
			<path d={c.front} class="front-line" />
		{/each}
		<!-- the sources, the lines from them to the pixel, and their velocities -->
		{#each sources as s, i (i)}
			{@const p = at(s.position)}
			{@const speed = norm(s.velocity)}
			<path d={arrowTo(p, { x: 0, y: 0 })} class="tether" />
			{#if speed > 0.005}
				{@const v = at(s.velocity)}
				<!-- 80 pixels for c, in the direction it moves as the screen shows it -->
				<path
					d={arrowTo(p, { x: p.x + (v.x / U) * 80, y: p.y + (v.y / U) * 80 })}
					class="velocity"
					marker-end="url(#{marker}-ink)"
				/>
			{/if}
			<circle
				cx={p.x}
				cy={p.y}
				r={7 + 6 * Math.cbrt(s.mass / 1e3)}
				class="source"
				data-source={i}
				role="button"
				tabindex="-1"
				aria-label="source {i + 1}: drag to move"
			/>
		{/each}
		{#if wave}
			{@const k = at(wave.k)}
			<path
				d={arrowTo({ x: 0, y: 0 }, { x: k.x * 0.78, y: k.y * 0.78 })}
				class="wave"
				marker-end="url(#{marker}-ink)"
			/>
			<text class="label" x={k.x * 0.5 + 10} y={k.y * 0.5 - 8}>k̂</text>
		{/if}
		<!-- the stars in front -->
		{#each stars as s, i (i)}
			{#each dots(s) as d, j (j)}
				{#if d.z >= 0}<circle cx={d.x} cy={d.y} r="4" style:fill={colour} class="star" />{/if}
			{/each}
		{/each}
		{#if mid}
			{@const m = at(mid)}
			{@const truth = at(sideways(sources[0]))}
			<circle cx={truth.x} cy={truth.y} r="7" class="truth" />
			<path
				d={arrowTo({ x: 0, y: 0 }, m)}
				class="mid"
				marker-end="url(#{marker}-head)"
				style:stroke={colour}
			/>
		{/if}
		<circle r="3" class="pixel" />
		<text class="words" x="0" y="128" dy="1em">{words}</text>
	</svg>
{/snippet}

<div class="skies">
	<div class="pair">
		{@render sky(
			'gravity',
			'four directions',
			gravity.stars,
			GRAVITY,
			'g',
			gravity.read,
			typeWords[gravity.type] ?? gravity.type
		)}
		{@render sky(
			'light',
			'two directions',
			light.stars,
			LIGHT,
			'l',
			midLight,
			sources.length > 1 ? 'the same two for one charge or many' : 'always two'
		)}
	</div>
</div>

<style>
	.skies {
		position: absolute;
		container-type: size;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--stage-pad, 2rem 1.5rem);
		/* the size of the words on the screen, as on every figure */
		--t: 12px;
		background: radial-gradient(circle at 50% 45%, var(--bg-raised) 0%, var(--bg-sunken) 70%);
		/* light's colour, beside gravity's (the accent), in either theme */
		--c-light: #7fb4ff;
	}
	:global(:root[data-theme='light']) .skies {
		--c-light: #2d5f8e;
	}
	@media (prefers-color-scheme: light) {
		:global(:root:not([data-theme='dark'])) .skies {
			--c-light: #2d5f8e;
		}
	}
	:global(:root .always-dark) .skies {
		--c-light: #7fb4ff;
	}

	/* gravity above light, each as large as half the picture allows */
	.sky {
		flex: none;
		width: var(--figure-width, min(86cqw, calc((50cqh - 0.5rem) * 380 / 372)));
		height: auto;
		touch-action: none;
		user-select: none;
		cursor: grab;
	}

	/* a wide picture: the two side by side */
	.pair {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	@container (aspect-ratio > 1.05) {
		.pair {
			flex-direction: row;
			gap: 2cqw;
		}
		.sky {
			width: var(--figure-width, min(47cqw, 34rem, calc(100cqh * 380 / 372)));
		}
	}

	@container (max-width: 34rem) {
		.sky {
			--t: 11px;
		}
	}

	.sky-disc {
		fill: color-mix(in srgb, var(--text) 5.5%, transparent);
		stroke: color-mix(in srgb, var(--text) 34%, transparent);
		stroke-width: 1;
	}
	.front-line {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 28%, transparent);
		stroke-width: 1;
	}
	.back-line {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 18%, transparent);
		stroke-width: 1;
		stroke-dasharray: 3 4;
	}
	.tether {
		stroke: color-mix(in srgb, var(--text) 40%, transparent);
		stroke-width: 1;
		stroke-dasharray: 3 4;
	}
	.velocity,
	.wave {
		stroke: var(--text);
		stroke-width: 1.6;
		fill: none;
	}
	.mid {
		stroke-width: 2.2;
		fill: none;
	}
	.truth {
		fill: none;
		stroke: var(--text);
		stroke-width: 1;
		stroke-dasharray: 2 2;
	}
	.source {
		fill: var(--text-dim);
		stroke: var(--text);
		stroke-width: 1;
		cursor: grab;
	}
	/* reached by the pointer alone (tabindex -1): no focus ring */
	.source:focus {
		outline: none;
	}
	.star {
		stroke: var(--bg-sunken);
		stroke-width: 1.1;
	}
	.pixel,
	.ink {
		fill: var(--text);
	}
	text {
		font-family: var(--font-sans);
		font-size: calc(var(--t) * var(--u, 1));
		text-anchor: middle;
		pointer-events: none;
	}
	.title {
		font-size: calc((var(--t) + 1px) * var(--u, 1));
		font-weight: 600;
	}
	.dim {
		fill: var(--text-dim);
		font-weight: 400;
	}
	.label {
		fill: var(--text);
		font-size: calc((var(--t) + 1px) * var(--u, 1));
		font-style: italic;
	}
	.words {
		fill: var(--text-dim);
	}
</style>
