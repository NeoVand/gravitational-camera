<script lang="ts">
	/**
	 * A room seen from above, a pixel crossing it, and what the pixel reads of its own velocity
	 * (lib/pixel/speedometer.ts): gravity every component, light only the part across its field. A meter shows the
	 * test for motion, the size of the eigenvalues' imaginary part, on a scale of decades. Drag the pixel to move it.
	 */
	import { fitText } from './figure-text';
	import type { Vec3 } from '../pixel/complex';
	import type { Thing } from '../pixel/speedometer';

	interface Props {
		room: Thing[];
		pixel: Vec3;
		/** the pixel's true velocity, units of c */
		v: Vec3;
		gravity: Vec3;
		light: { read: Vec3; along: Vec3 };
		alarm: number;
		onmove: (p: Vec3) => void;
	}

	let { room, pixel, v, gravity, light, alarm, onmove }: Props = $props();

	const S = 64; // drawing units per metre
	const ARROW = 2.4 * S; // per c
	const X = (p: Vec3) => p[0] * S;
	const Y = (p: Vec3) => -p[1] * S;

	const tip: Vec3 = $derived([pixel[0] + light.read[0], pixel[1] + light.read[1], 0]);
	const decades = $derived(Math.log10(Math.max(alarm, 1e-17)));
	const lit = $derived(alarm > 1e-12);
	/** The size of the drawing's words in its units: the foot of the drawing makes room for the meter's numbers. */
	let em = $state(12);
	/**
	 * The meter and its words, laid out across the drawing (660 wide, kept 6 inside either edge) by the size of the
	 * words in its units, which is largest on a phone. Its name starts right of the scale, clear of the last number
	 * (10⁰, about 0.8 em either side of its mark); its state ends left of it, the room kept for the longer one
	 * (“something moves”, about 8.6 em; the name about 5.4 em). Where they all fit, as on a wide screen, the scale is
	 * 300 long and centred; where they do not, it is shortened and moved over, until they do. Shortened so far that
	 * its numbers would touch (each about 2.3 em wide, four decades apart), as on the narrowest phones, the scale
	 * keeps its length and the two words go on a line under the numbers, at the drawing's two edges.
	 */
	const layout = $derived.by(() => {
		const state = 8.6 * em;
		const name = 5.4 * em;
		const gap = Math.max(12, 2.3 * em - 22);
		const half = Math.min(150, (648 - state - 12 - gap - name) / 2);
		if (half < 5.9 * em) return { half: 150, shift: 0, name: 324, stacked: true };
		const shift = Math.min(
			Math.max(0, -324 + half + 12 + state),
			Math.max(0, 324 - half - gap - name)
		);
		return { half, shift, name: half + gap, stacked: false };
	});
	const meter = (d: number) => -layout.half + ((d + 17) / 17) * 2 * layout.half;
	/** The foot of the drawing: room for the meter's numbers, and for its words under them when they are stacked. */
	const foot = $derived(Math.max(250, 236 + (layout.stacked ? 3 : 1.4) * em));

	let dragging = false;
	function down(e: PointerEvent) {
		if (!(e.target as Element).closest('[data-pixel]')) return;
		// a drag is not a click: the pixel does not take the focus, and no ring is drawn round it
		e.preventDefault();
		(e.currentTarget as SVGSVGElement).setPointerCapture(e.pointerId);
		dragging = true;
	}
	function move(e: PointerEvent) {
		if (!dragging) return;
		const m = (e.currentTarget as SVGSVGElement).getScreenCTM();
		if (!m) return;
		const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
		onmove([Math.max(-4.6, Math.min(4.6, p.x / S)), Math.max(-2.9, Math.min(2.9, -p.y / S)), 0]);
	}
	const arrow = (from: Vec3, d: Vec3) =>
		`M${X(from).toFixed(1)},${Y(from).toFixed(1)}l${(d[0] * ARROW).toFixed(1)},${(-d[1] * ARROW).toFixed(1)}`;
</script>

<div class="frame">
	<svg
		viewBox="-330 -250 660 {250 + foot}"
		role="img"
		aria-label="A room of masses seen from above, a pixel crossing it, and the velocity it reads"
		onpointerdown={down}
		onpointermove={move}
		onpointerup={() => (dragging = false)}
		onpointercancel={() => (dragging = false)}
		{@attach fitText((_, size) => (em = size))}
	>
		<defs>
			{#each [['white', 'var(--text)'], ['g', 'var(--accent)'], ['l', 'var(--c-light)'], ['m', 'var(--bad)']] as [id, c] (id)}
				<marker
					id="sp-{id}"
					viewBox="0 0 10 10"
					refX="9"
					refY="5"
					markerWidth="5"
					markerHeight="5"
					orient="auto"
				>
					<path d="M0,0L10,5L0,10z" style:fill={c} />
				</marker>
			{/each}
			<!-- what is drawn in the room stays in it, clear of the meter under it -->
			<clipPath id="sp-room">
				<rect x={-4.9 * S} y={-3.2 * S} width={9.8 * S} height={6.4 * S} rx="10" />
			</clipPath>
		</defs>
		<rect x={-4.9 * S} y={-3.2 * S} width={9.8 * S} height={6.4 * S} rx="10" class="room" />
		{#each room as t, i (i)}
			<circle
				cx={X(t.position)}
				cy={Y(t.position)}
				r={7 + 9 * Math.cbrt(t.mass / 8e3)}
				class="mass"
			/>
			{#if t.velocity && t.velocity.some((x) => x !== 0)}
				<path
					d="M{X(t.position) + 16},{Y(t.position)}l0,-30"
					class="walk"
					marker-end="url(#sp-m)"
				/>
				<text x={X(t.position) + 22} y={Y(t.position) - 22} class="tag moving halo">moving</text>
			{/if}
		{/each}
		<!-- light cannot see along its field: the whole line is possible, as far as the walls -->
		<path
			clip-path="url(#sp-room)"
			d="M{X(tip) - light.along[0] * 2 * ARROW},{Y(tip) + light.along[1] * 2 * ARROW}L{X(tip) +
				light.along[0] * 2 * ARROW},{Y(tip) - light.along[1] * 2 * ARROW}"
			class="unknown"
		/>
		<path d={arrow(pixel, v)} class="truth" marker-end="url(#sp-white)" />
		<path d={arrow(pixel, light.read)} class="light" marker-end="url(#sp-l)" />
		<path d={arrow(pixel, gravity)} class="gravity" marker-end="url(#sp-g)" />
		<circle
			cx={X(pixel)}
			cy={Y(pixel)}
			r="9"
			class="pixel"
			data-pixel
			role="button"
			tabindex="-1"
			aria-label="the pixel: drag to move it"
		/>
		<!-- the test for motion -->
		<g transform="translate({layout.shift} 228)">
			<text
				x={layout.stacked ? -324 : -layout.half - 12}
				y={layout.stacked ? 8 + 2.3 * em : 0}
				dy="0.35em"
				class={['tag', { end: !layout.stacked, moving: lit }]}
				>{lit ? 'something moves' : 'all still'}</text
			>
			<line x1={-layout.half} x2={layout.half} class="scale" />
			{#each [-16, -12, -8, -4, 0] as d (d)}
				<line x1={meter(d)} x2={meter(d)} y1="-4" y2="4" class="scale" />
				<text x={meter(d)} y="8" dy="1em" class="tick"
					>10<tspan class="sup" dy="-0.5em">{d}</tspan></text
				>
			{/each}
			<line x1={meter(-12)} x2={meter(-12)} y1="-10" y2="5" class="threshold" />
			<circle cx={meter(decades)} cy="0" r="6" class={['reading', { moving: lit }]} />
			<text
				x={layout.name}
				y={layout.stacked ? 8 + 2.3 * em : 0}
				dy="0.35em"
				class={['tag', { end: layout.stacked }]}>motion test</text
			>
		</g>
	</svg>
	<p class="legend">
		<span class="w">true velocity</span> · <span class="g">read by gravity</span> ·
		<span class="l">read by light,</span>
		<span class="l">which cannot see along the dotted line</span>
	</p>
</div>

<style>
	.frame {
		position: absolute;
		container-type: size;
		inset: 0;
		display: grid;
		place-items: center;
		padding: var(--stage-pad, 1.5rem 1.5rem 4rem);
		/* the size of the words on the screen, as on every figure */
		--t: 12px;
		background: radial-gradient(circle at 50% 45%, var(--bg-raised) 0%, var(--bg-sunken) 70%);
		/* light's colour, beside gravity's (the accent), in either theme */
		--c-light: #7fb4ff;
	}
	:global(:root[data-theme='light']) .frame {
		--c-light: #2d5f8e;
	}
	@media (prefers-color-scheme: light) {
		:global(:root:not([data-theme='dark'])) .frame {
			--c-light: #2d5f8e;
		}
	}
	:global(:root .always-dark) .frame {
		--c-light: #7fb4ff;
	}
	/* the room as large as the picture allows */
	svg {
		display: block;
		width: var(--figure-width, min(100cqw, 64rem, calc(100cqh * 660 / 500)));
		height: auto;
		touch-action: none;
		user-select: none;
	}
	@container (max-width: 34rem) {
		svg {
			--t: 11px;
		}
	}
	.room {
		fill: color-mix(in srgb, var(--text) 3%, transparent);
		stroke: color-mix(in srgb, var(--text) 24%, transparent);
	}
	.mass {
		fill: var(--text-dim);
	}
	.walk {
		stroke: var(--bad);
		stroke-width: 2;
	}
	.truth {
		stroke: var(--text);
		stroke-width: 1.5;
		stroke-dasharray: 5 4;
	}
	.gravity {
		stroke: var(--accent);
		stroke-width: 3;
		stroke-linecap: round;
	}
	.light {
		stroke: var(--c-light);
		stroke-width: 2;
	}
	.unknown {
		stroke: var(--c-light);
		stroke-width: 1;
		stroke-dasharray: 2 5;
		opacity: 0.7;
	}
	.pixel {
		fill: var(--text);
		stroke: var(--bg-sunken);
		stroke-width: 2;
		cursor: grab;
	}
	/* reached by the pointer alone (tabindex -1): no focus ring */
	.pixel:focus {
		outline: none;
	}
	.scale {
		stroke: color-mix(in srgb, var(--text) 36%, transparent);
	}
	.threshold {
		stroke: color-mix(in srgb, var(--text) 56%, transparent);
		stroke-dasharray: 2 2;
	}
	/* the meter's mark: the accent while all is still, the theme's red once something moves */
	.reading {
		fill: var(--accent);
		stroke: var(--bg-sunken);
		stroke-width: 1.5;
	}
	text {
		font-family: var(--font-sans);
		font-size: calc(var(--t) * var(--u, 1));
		pointer-events: none;
	}
	.sup {
		font-size: 0.85em;
	}
	.tag {
		fill: var(--text-dim);
	}
	.halo {
		paint-order: stroke;
		stroke: var(--bg-sunken);
		stroke-width: calc(4px * var(--u, 1));
		stroke-linejoin: round;
	}
	.reading.moving,
	.tag.moving {
		fill: var(--bad);
	}
	.end {
		text-anchor: end;
	}
	.tick {
		fill: var(--text-dim);
		text-anchor: middle;
	}
	/* the caption, as on every figure: a pill at the foot of the picture; on a narrow picture it takes two lines,
	   breaking only between its parts */
	.legend {
		position: absolute;
		left: 50%;
		bottom: var(--tag-inset, 14px);
		translate: -50% 0;
		width: max-content;
		max-width: calc(100% - 2rem);
		margin: 0;
		padding: 0.4em 0.85em;
		border-radius: 1em;
		background: color-mix(in srgb, var(--bg-sunken) 72%, transparent);
		border: 1px solid var(--line-strong);
		backdrop-filter: blur(6px);
		color: var(--text-dim);
		font: 500 0.75rem/1.35 var(--font-sans);
		text-align: center;
		text-wrap: balance;
		pointer-events: none;
	}
	.legend span {
		white-space: nowrap;
	}
	.w {
		color: var(--text);
	}
	.g {
		color: var(--accent);
	}
	.l {
		color: var(--c-light);
	}
</style>
