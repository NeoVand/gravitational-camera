<script lang="ts">
	/**
	 * One pixel hearing several waves at once: the ten numbers it reads, scrolling, and the sky as each kind of pixel
	 * finds it from those numbers alone (lib/pixel/voices.ts): shaded by how far each direction is from silencing
	 * every combination the readings leave at zero, with the sources ringed and the directions found as dots.
	 * Drag a source to move it; drag anywhere else on a sky to turn it.
	 */
	import type { Vec3 } from '../pixel/complex';
	import { vec5 } from '../pixel/pixel';
	import { greatCircle, project, toWorld } from '../pixel/view';
	import type { Found, Reading } from '../pixel/voices';

	interface Props {
		/** directions toward the sources */
		sources: Vec3[];
		readings: Reading[];
		gravity: Found;
		light: Found;
		yaw: number;
		pitch: number;
		onmove: (index: number, direction: Vec3) => void;
	}

	let {
		sources,
		readings,
		gravity,
		light,
		yaw = $bindable(),
		pitch = $bindable(),
		onmove
	}: Props = $props();

	const R = 120; // drawing units for the sky's radius
	const VOICE = ['#e8a45a', '#7fb4ff', '#7bd88f', '#d9a6ff', '#ff9c8a'];
	const view = $derived({ yaw, pitch });
	const at = (p: Vec3) => project(view, p, R);
	const circles = $derived([greatCircle(view, [0, 1, 0], R), greatCircle(view, [0, 0, 1], R)]);

	// --- the map of each sky, as an image under the drawing, refreshed a few times a second -----------------------
	let maps = $state<{ gravity: string; light: string }>({ gravity: '', light: '' });
	let lastMap = 0;
	const SIZE = 104;

	function render(found: Found, tint: [number, number, number]): string {
		if (typeof document === 'undefined') return '';
		const canvas = document.createElement('canvas');
		canvas.width = canvas.height = SIZE;
		const ctx = canvas.getContext('2d')!;
		const img = ctx.createImageData(SIZE, SIZE);
		const values = new Float32Array(SIZE * SIZE).fill(NaN);
		let top = 0;
		for (let j = 0; j < SIZE; j++)
			for (let i = 0; i < SIZE; i++) {
				const x = ((i + 0.5) / SIZE) * 2 - 1,
					y = 1 - ((j + 0.5) / SIZE) * 2;
				const rr = x * x + y * y;
				if (rr > 1) continue;
				const v = found.map(toWorld(view, [x, y, Math.sqrt(1 - rr)]));
				values[j * SIZE + i] = v;
				top = Math.max(top, v);
			}
		for (let k = 0; k < SIZE * SIZE; k++) {
			const v = values[k];
			if (Number.isNaN(v)) continue;
			// three decades below the largest value, dark where every silent combination vanishes
			const s =
				top > 0 ? Math.max(0, Math.min(1, 1 + Math.log10(Math.max(v / top, 1e-12)) / 3)) : 0;
			const shade = 0.15 + 0.85 * s;
			img.data[k * 4] = tint[0] * shade;
			img.data[k * 4 + 1] = tint[1] * shade;
			img.data[k * 4 + 2] = tint[2] * shade;
			img.data[k * 4 + 3] = found.silent ? 120 : 0;
		}
		ctx.putImageData(img, 0, 0);
		return canvas.toDataURL();
	}

	// at most four redraws a second, and always one after the last change
	$effect(() => {
		const g = gravity,
			l = light;
		void view;
		const draw = () => {
			lastMap = performance.now();
			maps = { gravity: render(g, [232, 164, 90]), light: render(l, [127, 180, 255]) };
		};
		const wait = 250 - (performance.now() - lastMap);
		if (wait <= 0) {
			draw();
			return;
		}
		const timer = setTimeout(draw, wait);
		return () => clearTimeout(timer);
	});

	// --- the ten numbers, scrolling ----------------------------------------------------------------------------------
	const traces = $derived.by(() => {
		if (!readings.length) return [];
		const rows = readings.map((r) => vec5(r.W));
		const series = [0, 1, 2, 3, 4].flatMap((k) => [
			rows.map((r) => r[k].re),
			rows.map((r) => r[k].im)
		]);
		const top = Math.max(1e-9, ...series.flat().map(Math.abs));
		const W = 760,
			H = 18;
		return series.map((s) =>
			s
				.map(
					(v, i) =>
						`${i ? 'L' : 'M'}${((i / (s.length - 1)) * W).toFixed(1)},${(-(v / top) * H * 0.9).toFixed(1)}`
				)
				.join('')
		);
	});

	// --- dragging ----------------------------------------------------------------------------------------------------
	let drag:
		| { kind: 'source'; index: number }
		| { kind: 'turn'; x: number; y: number; yaw: number; pitch: number }
		| undefined;

	function down(e: PointerEvent) {
		const svg = e.currentTarget as SVGSVGElement;
		svg.setPointerCapture(e.pointerId);
		const target = (e.target as Element).closest('[data-source]');
		drag = target
			? { kind: 'source', index: Number(target.getAttribute('data-source')) }
			: { kind: 'turn', x: e.clientX, y: e.clientY, yaw, pitch };
	}

	function move(e: PointerEvent) {
		if (!drag) return;
		if (drag.kind === 'turn') {
			yaw = drag.yaw + (e.clientX - drag.x) * 0.008;
			pitch = Math.max(-1.45, Math.min(1.45, drag.pitch + (e.clientY - drag.y) * 0.008));
			return;
		}
		const svg = e.currentTarget as SVGSVGElement;
		const m = svg.getScreenCTM();
		if (!m) return;
		const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
		let x = p.x / R,
			y = -p.y / R;
		const r = Math.hypot(x, y);
		if (r > 0.98) {
			x *= 0.98 / r;
			y *= 0.98 / r;
		}
		onmove(drag.index, toWorld(view, [x, y, Math.sqrt(Math.max(0, 1 - x * x - y * y))]));
	}
</script>

{#snippet sky(name: string, colour: string, found: Found, map: string, capacity: number)}
	<svg
		viewBox="-150 -168 300 328"
		class="sky"
		role="img"
		aria-label="{name}: the sky as found from the readings"
		onpointerdown={down}
		onpointermove={move}
		onpointerup={() => (drag = undefined)}
		onpointercancel={() => (drag = undefined)}
	>
		<text class="title" x="0" y="-146" fill={colour}>{name}</text>
		<circle r={R} class="sky-disc" />
		{#if map}<image
				href={map}
				x={-R}
				y={-R}
				width={2 * R}
				height={2 * R}
				preserveAspectRatio="none"
			/>{/if}
		{#each circles as c, i (i)}
			<path d={c.back} class="back-line" />
			<path d={c.front} class="front-line" />
		{/each}
		{#each sources as s, i (i)}
			{@const p = at(s)}
			{#if p.z >= 0}
				<circle
					cx={p.x}
					cy={p.y}
					r="11"
					class="ring"
					stroke={VOICE[i]}
					data-source={i}
					role="button"
					tabindex="-1"
					aria-label="source {i + 1}: drag to move"
				/>
				<text class="num" x={p.x + 15} y={p.y - 11} fill={VOICE[i]}>{i + 1}</text>
			{:else}
				<circle cx={p.x} cy={p.y} r="8" class="ring behind" stroke={VOICE[i]} />
			{/if}
		{/each}
		{#each found.directions as d, i (i)}
			{@const p = at(d)}
			<circle cx={p.x} cy={p.y} r="4" fill={colour} class={['found', { behind: p.z < 0 }]} />
		{/each}
		<text class="words" x="0" y="150">
			{#if found.silent === 0}
				{sources.length} waves fill all {capacity * 2} numbers: nothing to find
			{:else}
				found {found.directions.length} of {sources.length}
			{/if}
		</text>
	</svg>
{/snippet}

<div class="stage">
	<svg
		viewBox="-40 -14 820 210"
		class="traces"
		role="img"
		aria-label="The ten numbers the pixel reads, over time"
	>
		{#each traces as d, i (i)}
			<g transform="translate(0 {i * 19 + 4})">
				<text x="-8" y="4" class="trace-name"
					>{i % 2 ? 'B' : 'E'}<tspan dy="3" font-size="8">{Math.floor(i / 2) + 1}</tspan></text
				>
				<path {d} class={['trace', { b: i % 2 }]} />
			</g>
		{/each}
	</svg>
	<div class="skies">
		{@render sky('gravity: up to four', '#e8a45a', gravity, maps.gravity, 5)}
		{@render sky('light: up to two', '#7fb4ff', light, maps.light, 3)}
	</div>
</div>

<style>
	.stage {
		position: absolute;
		container-type: size;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: var(--stage-pad, 4.5rem 1rem 5.5rem);
		background: radial-gradient(circle at 50% 55%, #2a2016 0%, #18120b 70%);
	}
	.traces {
		width: var(--traces-width, min(52cqw, 640px));
		height: auto;
	}
	.skies {
		display: flex;
		gap: 1.5cqw;
	}
	.sky {
		width: var(--figure-width, min(26cqw, 38cqh));
		height: auto;
		touch-action: none;
		user-select: none;
		cursor: grab;
	}
	@container (aspect-ratio < 1) {
		.traces {
			width: 92cqw;
		}
		.sky {
			width: 44cqw;
		}
	}
	.sky-disc {
		fill: rgb(255 255 255 / 0.04);
		stroke: rgb(255 255 255 / 0.3);
	}
	.front-line {
		fill: none;
		stroke: rgb(255 255 255 / 0.22);
	}
	.back-line {
		fill: none;
		stroke: rgb(255 255 255 / 0.1);
		stroke-dasharray: 3 4;
	}
	.ring {
		fill: rgb(0 0 0 / 0.001);
		stroke-width: 2;
		cursor: grab;
	}
	.ring.behind {
		opacity: 0.35;
		stroke-dasharray: 2 2;
		pointer-events: none;
	}
	.found {
		stroke: #18120b;
		stroke-width: 1.2;
	}
	.found.behind {
		opacity: 0.35;
	}
	.trace {
		fill: none;
		stroke: #e9e6df;
		stroke-width: 1;
	}
	.trace.b {
		stroke: #a09d96;
	}
	text {
		font-family: var(--font-sans);
		pointer-events: none;
	}
	.title,
	.words {
		text-anchor: middle;
	}
	.title {
		font-size: 15px;
		font-weight: 600;
	}
	.words {
		fill: #a09d96;
		font-size: 12px;
	}
	.num {
		font-size: 13px;
		font-weight: 600;
	}
	.trace-name {
		fill: #a09d96;
		font-size: 10px;
		text-anchor: end;
		font-style: italic;
	}
</style>
