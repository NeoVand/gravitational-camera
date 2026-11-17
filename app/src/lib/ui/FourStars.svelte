<script lang="ts">
	/**
	 * Two skies around one point: the stars of gravity's field there (four) and of light's (two), for the same
	 * sources (lib/pixel/scene.ts). Drag a source to move it; drag anywhere else to turn the sky.
	 */
	import { norm, unit, type Vec3 } from '../pixel/complex';
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
	const GRAVITY = '#e8a45a';
	const LIGHT = '#7fb4ff';

	const gravity = $derived(readGravity(sources, wave));
	const light = $derived(readLight(sources, wave));

	/** World to camera: turn by yaw about y, then tilt by pitch about x; z toward the viewer. */
	function cam(p: Vec3): Vec3 {
		const cy = Math.cos(yaw),
			sy = Math.sin(yaw),
			cp = Math.cos(pitch),
			sp = Math.sin(pitch);
		const x1 = cy * p[0] + sy * p[2],
			z1 = -sy * p[0] + cy * p[2];
		return [x1, cp * p[1] - sp * z1, sp * p[1] + cp * z1];
	}
	function world(q: Vec3): Vec3 {
		const cy = Math.cos(yaw),
			sy = Math.sin(yaw),
			cp = Math.cos(pitch),
			sp = Math.sin(pitch);
		const y1 = cp * q[1] + sp * q[2],
			z1 = -sp * q[1] + cp * q[2];
		return [cy * q[0] - sy * z1, y1, sy * q[0] + cy * z1];
	}
	const at = (p: Vec3) => {
		const q = cam(p);
		return { x: U * q[0], y: -U * q[1], z: q[2] };
	};

	/** A great circle of the sky as two paths, the half in front and the half behind. */
	function circle(normal: Vec3): { front: string; back: string } {
		const n = unit(normal);
		const a: Vec3 = Math.abs(n[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
		const along = a[0] * n[0] + a[1] * n[1] + a[2] * n[2];
		const u = unit([a[0] - along * n[0], a[1] - along * n[1], a[2] - along * n[2]]);
		const w: Vec3 = [
			n[1] * u[2] - n[2] * u[1],
			n[2] * u[0] - n[0] * u[2],
			n[0] * u[1] - n[1] * u[0]
		];
		let front = '',
			back = '';
		let prev: boolean | undefined;
		for (let k = 0; k <= 120; k++) {
			const t = (2 * Math.PI * k) / 120;
			const p = at([0, 1, 2].map((i) => Math.cos(t) * u[i] + Math.sin(t) * w[i]) as Vec3);
			const isFront = p.z >= 0;
			const cmd = prev === isFront ? 'L' : 'M';
			if (isFront) front += `${cmd}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
			else back += `${cmd}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
			prev = isFront;
		}
		return { front, back };
	}
	const circles = $derived([circle([0, 1, 0]), circle([0, 0, 1])]);

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
		D: 'type D: could be one body',
		I: 'type I: more than one source',
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
		w = w.map((x) => (x * clamped) / r) as Vec3;
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
		aria-label="{name}: the stars of the field on the sky around the pixel"
		onpointerdown={down}
		onpointermove={move}
		onpointerup={up}
		onpointercancel={up}
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
				<path d="M0,0L10,5L0,10z" fill={colour} />
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
				<path d="M0,0L10,5L0,10z" fill="#e9e6df" />
			</marker>
		</defs>
		<text class="title" x="0" y="-188" fill={colour}
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
						fill={colour}
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
				{#if d.z >= 0}<circle cx={d.x} cy={d.y} r="4" fill={colour} class="star" />{/if}
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
		<text class="words" x="0" y="146">{words}</text>
	</svg>
{/snippet}

<div class="skies">
	{@render sky(
		'gravity',
		'four stars',
		gravity.stars,
		GRAVITY,
		'g',
		gravity.read,
		typeWords[gravity.type] ?? gravity.type
	)}
	{@render sky(
		'light',
		'two stars',
		light.stars,
		LIGHT,
		'l',
		midLight,
		sources.length > 1 ? 'the same two for one charge or many' : 'always two'
	)}
</div>

<style>
	.skies {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5vh;
		padding: 4.5rem 1rem 5.5rem;
		background: radial-gradient(circle at 50% 45%, #10141b 0%, #07090d 70%);
	}

	/* gravity above light, in a column between the cards */
	.sky {
		width: min(43vh, 36vw);
		height: auto;
		touch-action: none;
		user-select: none;
		cursor: grab;
	}

	@media (orientation: portrait) {
		.skies {
			padding: 4.5rem 1rem 7rem;
		}
		.sky {
			width: min(86vw, 40vh);
		}
	}

	.sky-disc {
		fill: rgb(255 255 255 / 0.055);
		stroke: rgb(255 255 255 / 0.3);
		stroke-width: 1;
	}
	.front-line {
		fill: none;
		stroke: rgb(255 255 255 / 0.24);
		stroke-width: 1;
	}
	.back-line {
		fill: none;
		stroke: rgb(255 255 255 / 0.14);
		stroke-width: 1;
		stroke-dasharray: 3 4;
	}
	.tether {
		stroke: rgb(255 255 255 / 0.35);
		stroke-width: 1;
		stroke-dasharray: 3 4;
	}
	.velocity,
	.wave {
		stroke: #e9e6df;
		stroke-width: 1.6;
		fill: none;
	}
	.mid {
		stroke-width: 2.2;
		fill: none;
	}
	.truth {
		fill: none;
		stroke: #e9e6df;
		stroke-width: 1;
		stroke-dasharray: 2 2;
	}
	.source {
		fill: #a7a299;
		stroke: #e9e6df;
		stroke-width: 1;
		cursor: grab;
	}
	.star {
		stroke: #07090d;
		stroke-width: 1.1;
	}
	.pixel {
		fill: #e9e6df;
	}
	text {
		font-family: var(--font-sans);
		text-anchor: middle;
		pointer-events: none;
	}
	.title {
		font-size: 17px;
		font-weight: 600;
	}
	.dim {
		fill: #a09d96;
		font-weight: 400;
	}
	.label {
		fill: #e9e6df;
		font-size: 14px;
		font-style: italic;
	}
	.words {
		fill: #a09d96;
		font-size: 13px;
	}
</style>
