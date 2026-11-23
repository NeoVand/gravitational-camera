<script lang="ts">
	/**
	 * A room seen from above, a pixel crossing it, and what the pixel reads of its own velocity
	 * (lib/pixel/speedometer.ts): gravity every component, light only the part across its field. A meter shows the
	 * test for motion, the size of the eigenvalues' imaginary part, on a scale of decades. Drag the pixel to move it.
	 */
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
	const meter = (d: number) => -150 + ((d + 17) / 16) * 300;

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
		viewBox="-330 -250 660 500"
		role="img"
		aria-label="A room of masses seen from above, a pixel crossing it, and the velocity it reads"
		onpointerdown={down}
		onpointermove={move}
		onpointerup={() => (dragging = false)}
		onpointercancel={() => (dragging = false)}
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
				<text x={X(t.position) + 22} y={Y(t.position) - 22} class="tag moving">moving</text>
			{/if}
		{/each}
		<!-- light cannot see along its field: the whole line is possible -->
		<path
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
		<g transform="translate(0 228)">
			<text x="-160" y="4" class={['tag', 'end', { moving: lit }]}
				>{lit ? 'something moves' : 'all still'}</text
			>
			<line x1="-150" x2="150" class="scale" />
			{#each [-16, -12, -8, -4, 0] as d (d)}
				<line x1={meter(d)} x2={meter(d)} y1="-4" y2="4" class="scale" />
				<text x={meter(d)} y="18" class="tick">10<tspan dy="-5" font-size="8">{d}</tspan></text>
			{/each}
			<line x1={meter(-12)} x2={meter(-12)} y1="-9" y2="9" class="threshold" />
			<circle cx={meter(decades)} cy="0" r="6" class={['reading', { moving: lit }]} />
			<text x="160" y="4" class="tag">motion test</text>
		</g>
	</svg>
	<p class="legend">
		<span class="w">true velocity</span> · <span class="g">read by gravity</span> ·
		<span class="l">read by light, which cannot see along the dashed line</span>
	</p>
</div>

<style>
	.frame {
		position: absolute;
		container-type: size;
		inset: 0;
		display: grid;
		place-items: center;
		padding: var(--stage-pad, 4.5rem 1rem 6.5rem);
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
	svg {
		width: var(--figure-width, min(62cqw, 120cqh));
		max-height: 100%;
		touch-action: none;
		user-select: none;
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
	.reading {
		fill: var(--good);
	}
	text {
		font-family: var(--font-sans);
		pointer-events: none;
	}
	.tag {
		font-size: 12px;
		fill: var(--text-dim);
	}
	.reading.moving,
	.tag.moving {
		fill: var(--bad);
	}
	.end {
		text-anchor: end;
	}
	.tick {
		font-size: 10px;
		fill: var(--text-dim);
		text-anchor: middle;
	}
	.legend {
		position: absolute;
		left: 50%;
		bottom: var(--tag-inset, 14px);
		translate: -50% 0;
		margin: 0;
		padding: 0.4em 0.75em;
		border-radius: 999px;
		background: color-mix(in srgb, var(--bg-sunken) 60%, transparent);
		border: 1px solid var(--line-strong);
		color: var(--text-dim);
		font: 500 0.7rem/1.2 var(--font-sans);
		white-space: nowrap;
		pointer-events: none;
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
