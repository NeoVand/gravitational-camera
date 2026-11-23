<script lang="ts">
	/**
	 * One pixel hearing several waves at once: the ten numbers it reads, scrolling, and the sky as each kind of pixel
	 * finds it from those numbers alone (lib/pixel/voices.ts): shaded by how far each direction is from silencing
	 * every combination the readings leave at zero, with the sources ringed and the directions found as dots.
	 * Drag a source to move it; drag anywhere else on a sky to turn it.
	 */
	import { fitText } from './figure-text';
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
	/** One colour to a source, from the theme (the style below sets those it lacks): SVG attributes cannot take var(). */
	const VOICE = ['var(--accent)', 'var(--c-light)', 'var(--good)', 'var(--c-violet)', 'var(--bad)'];
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
	/** The size of the words of the traces, in their drawing's units: each row is named only if there is room. */
	let traceEm = $state(12);
	const named = $derived(traceEm < 17);
	/** The size of the words of the skies, in their units: the foot of each sky makes room for two lines of them. */
	let skyEm = $state(12);

	let drag:
		| { kind: 'source'; index: number }
		| { kind: 'turn'; x: number; y: number; yaw: number; pitch: number }
		| undefined;

	function down(e: PointerEvent) {
		// a drag is not a click: nothing under it takes the focus, and no ring is drawn round it
		e.preventDefault();
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
		viewBox="-150 -168 300 {292 + 2.7 * skyEm}"
		class="sky"
		role="img"
		aria-label="{name}: the sky as found from the readings"
		onpointerdown={down}
		onpointermove={move}
		onpointerup={() => (drag = undefined)}
		onpointercancel={() => (drag = undefined)}
		{@attach fitText((_, size) => (skyEm = size))}
	>
		<text class="title" x="0" y="-140" style:fill={colour}>{name}</text>
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
					style:stroke={VOICE[i]}
					data-source={i}
					role="button"
					tabindex="-1"
					aria-label="source {i + 1}: drag to move"
				/>
				<text class="num" x={p.x + 15} y={p.y - 11} style:fill={VOICE[i]}>{i + 1}</text>
			{:else}
				<circle cx={p.x} cy={p.y} r="8" class="ring behind" style:stroke={VOICE[i]} />
			{/if}
		{/each}
		{#each found.directions as d, i (i)}
			{@const p = at(d)}
			<circle cx={p.x} cy={p.y} r="4" style:fill={colour} class={['found', { behind: p.z < 0 }]} />
		{/each}
		<text class="words" x="0" y="124">
			{#if found.silent === 0}
				<tspan x="0" dy="1.1em">{sources.length} waves fill all {capacity * 2} numbers:</tspan>
				<tspan x="0" dy="1.15em">nothing to find</tspan>
			{:else}
				<tspan x="0" dy="1.1em">found {found.directions.length} of {sources.length}</tspan>
			{/if}
		</text>
	</svg>
{/snippet}

<div class="stage">
	<svg
		viewBox="-52 {-14 - 1.7 * traceEm} 824 {210 + 1.7 * traceEm}"
		class="traces"
		role="img"
		aria-label="The ten numbers the pixel reads, over time"
		{@attach fitText((_, size) => (traceEm = size))}
	>
		<text x="380" y={-14 - 0.55 * traceEm} class="trace-title"
			>the ten numbers the pixel reads, as they come</text
		>
		{#each traces as d, i (i)}
			<g transform="translate(0 {i * 19 + 4})">
				{#if named}
					<text x="-10" y="0" dy="0.35em" class="trace-name"
						>{i % 2 ? 'B' : 'E'}<tspan class="sub" dy="0.3em">{Math.floor(i / 2) + 1}</tspan></text
					>
				{/if}
				<path {d} class={['trace', { b: i % 2 }]} />
			</g>
		{/each}
	</svg>
	<div class="skies">
		{@render sky('gravity: up to four', 'var(--accent)', gravity, maps.gravity, 5)}
		{@render sky('light: up to two', 'var(--c-light)', light, maps.light, 3)}
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
		gap: 1rem;
		padding: var(--stage-pad, 2rem 1.5rem);
		/* the size of the words on the screen, as on every figure */
		--t: 12px;
		background: radial-gradient(circle at 50% 55%, var(--bg-raised) 0%, var(--bg-sunken) 70%);
		/* light's colour, beside gravity's (the accent), and a fourth source's, in either theme */
		--c-light: #7fb4ff;
		--c-violet: #d9a6ff;
	}
	:global(:root[data-theme='light']) .stage {
		--c-light: #2d5f8e;
		--c-violet: #7a3fa8;
	}
	@media (prefers-color-scheme: light) {
		:global(:root:not([data-theme='dark'])) .stage {
			--c-light: #2d5f8e;
			--c-violet: #7a3fa8;
		}
	}
	:global(:root .always-dark) .stage {
		--c-light: #7fb4ff;
		--c-violet: #d9a6ff;
	}
	/* the numbers above, as wide as the two skies under them; the skies as large as what is left allows */
	.traces {
		flex: none;
		width: var(--traces-width, min(100%, 52rem));
		height: auto;
	}
	.skies {
		display: flex;
		gap: 2cqw;
	}
	.sky {
		flex: none;
		width: var(
			--figure-width,
			min(46cqw, 25rem, calc((100cqh - 0.27 * min(100cqw, 52rem) - 2.5rem) * 300 / 328))
		);
		height: auto;
		touch-action: none;
		user-select: none;
		cursor: grab;
	}
	/* a tall picture: the two skies one above the other */
	@container (aspect-ratio < 0.8) {
		.skies {
			flex-direction: column;
			gap: 1rem;
		}
		.sky {
			width: var(--figure-width, min(86cqw, calc((100cqh - 0.27 * 100cqw - 4rem) / 2 * 300 / 328)));
		}
	}
	@container (max-width: 34rem) {
		svg {
			--t: 11px;
		}
	}
	.sky-disc {
		fill: color-mix(in srgb, var(--text) 4%, transparent);
		stroke: color-mix(in srgb, var(--text) 34%, transparent);
	}
	.front-line {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 26%, transparent);
	}
	.back-line {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 13%, transparent);
		stroke-dasharray: 3 4;
	}
	.ring {
		fill: rgb(0 0 0 / 0.001);
		stroke-width: 2;
		cursor: grab;
	}
	/* reached by the pointer alone (tabindex -1): no focus ring */
	.ring:focus {
		outline: none;
	}
	.ring.behind {
		opacity: 0.35;
		stroke-dasharray: 2 2;
		pointer-events: none;
	}
	.found {
		stroke: var(--bg-sunken);
		stroke-width: 1.2;
	}
	.found.behind {
		opacity: 0.35;
	}
	.trace {
		fill: none;
		stroke: var(--text);
		stroke-width: 1;
	}
	.trace.b {
		stroke: var(--text-dim);
	}
	text {
		font-family: var(--font-sans);
		font-size: calc(var(--t) * var(--u, 1));
		pointer-events: none;
	}
	.title,
	.words,
	.trace-title {
		text-anchor: middle;
	}
	.title {
		font-size: calc((var(--t) + 1px) * var(--u, 1));
		font-weight: 600;
	}
	.words,
	.trace-title {
		fill: var(--text-dim);
	}
	.num {
		font-weight: 600;
	}
	.trace-name {
		fill: var(--text-dim);
		text-anchor: end;
		font-style: italic;
	}
	.sub {
		font-size: 0.85em;
	}
</style>
