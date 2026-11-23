<script lang="ts">
	/**
	 * The "Tidal field" panel of a demo: the tidal tensor that one pixel at the camera reads (lib/pixel/tide-demos.ts),
	 * as a ring of twelve free particles, its three principal values, each source's part, and one familiar tide for
	 * scale. Every number is in s⁻² and comes from the reading; nothing here is computed for show.
	 */
	import type { Vec3 } from '../engine/types';
	import {
		DRAWN,
		EARTH_TIDE,
		PERSON_TIDE,
		exaggeration,
		largest,
		nameAxis,
		principalPlane,
		principalRows,
		ring,
		share,
		size3
	} from '../pixel/tide';
	import { total, totalMagnetic, type Reading, type RingSpec } from '../pixel/tide-demos';
	import { duration, sci, tidal, times } from './format';

	interface Props {
		reading: Reading;
		/**
		 * The picture's own axes. With them a ring is drawn facing the viewer, in the plane of the picture, and a
		 * reading with one ring gets a second view of the same field: a ring edge-on to the viewer, seen from the side.
		 * Without them each ring is drawn in the plane of its two largest principal values, which are named beside it.
		 */
		basis?: { right: Vec3; up: Vec3; forward: Vec3 };
	}

	let { reading, basis }: Props = $props();

	/** The ring's radius at rest, in the drawing's units. */
	const R = 34;

	const all = $derived(total(reading));
	const rows = $derived(principalRows(all, reading.landmarks));
	const magnetic = $derived(totalMagnetic(reading));

	const sources = $derived(
		reading.sources
			.map((s) => ({
				label: s.label,
				value: largest(s.E).value,
				part: s.removed ? undefined : share(s.E, all),
				removed: s.removed === true,
				note: s.note,
				magnetic: s.B && !s.removed ? size3(s.B) : undefined
			}))
			.sort(
				(a, b) => Number(a.removed) - Number(b.removed) || Math.abs(b.value) - Math.abs(a.value)
			)
	);
	const moving = $derived(sources.filter((s) => s.magnetic !== undefined));

	/** A ring in the plane of the unit vectors u (drawn to the right) and v (drawn up), as `spec`'s field moves it. */
	function drawing(spec: RingSpec, u: Vec3, v: Vec3, label: string, lines: string[]) {
		const scale = spec.scale ?? size3(spec.E);
		const gain = scale > 0 ? DRAWN / scale : 0;
		// screen y runs down
		const place = (p: { x: number; y: number; ax: number; ay: number }) => ({
			x: R * (p.x + gain * p.ax),
			y: -R * (p.y + gain * p.ay)
		});
		const twelve = ring(spec.E, u, v);
		// coloured by which way a particle moves along the radius, against the largest such motion the field could give
		const particles = twelve.map((p) => ({
			from: { x: R * p.x, y: -R * p.y },
			to: place(p),
			kind: p.radial > 0.05 * scale ? 'stretch' : p.radial < -0.05 * scale ? 'squeeze' : 'still'
		}));
		const outline =
			ring(spec.E, u, v, 72)
				.map(place)
				.map((p, k) => `${k ? 'L' : 'M'}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
				.join('') + 'Z';
		return { label, particles, outline, lines };
	}

	/** How much a ring's change is exaggerated, in words. */
	function scaling(spec: RingSpec): string {
		const scale = spec.scale ?? size3(spec.E);
		if (scale === 0) return 'no field';
		const e = exaggeration(scale);
		return e.factor >= 1
			? `exaggerated ${times(e.factor)} times`
			: `not exaggerated: as after ${duration(e.fallTime)} of free fall`;
	}

	const size = (spec: RingSpec) =>
		tidal(spec.scale ?? size3(spec.E)) + (spec.most ? ' at most, over a turn' : '');

	const rings = $derived.by(() => {
		if (basis) {
			const { right, up, forward } = basis;
			const [only] = reading.rings;
			// one field: a ring facing the viewer, and one edge-on, seen from the viewer's right
			if (reading.rings.length === 1)
				return [
					drawing(only, right, up, only.label, [size(only), scaling(only), 'a ring facing you']),
					drawing(only, forward, up, 'The same, from the side', [
						'a ring edge-on to you',
						'you look from left to right',
						'the same exaggeration'
					])
				];
			return reading.rings.map((spec) =>
				drawing(spec, right, up, spec.label, [size(spec), scaling(spec)])
			);
		}
		return reading.rings.map((spec) => {
			let plane = principalPlane(spec.E);
			// of its two axes, the one nearer the demo's "up" is drawn up the page
			const top = reading.upright;
			if (top) {
				const lean = (a: Vec3) => Math.abs(a[0] * top[0] + a[1] * top[1] + a[2] * top[2]);
				if (lean(plane[0].axis) > lean(plane[1].axis)) plane = [plane[1], plane[0]];
			}
			return drawing(spec, plane[0].axis, plane[1].axis, spec.label, [
				size(spec),
				scaling(spec),
				`left to right: ${nameAxis(plane[0].axis, reading.landmarks)}`,
				`up and down: ${nameAxis(plane[1].axis, reading.landmarks)}`
			]);
		});
	});

	/** A share as a percentage, or as a fraction of the whole where it is too small for one. */
	const percent = (x: number) => {
		const a = Math.abs(100 * x);
		const sign = x < 0 ? '−' : '';
		if (a >= 9.95) return `${sign}${a.toFixed(0)}%`;
		if (a >= 0.0995) return `${sign}${a.toFixed(a >= 0.995 ? 1 : 2)}%`;
		return `${sign}${sci(Math.abs(x))} of it`;
	};

	/** The reading against a tide the reader knows (paper, Section II). */
	const familiar = $derived.by(() => {
		const value = size3(all);
		if (value === 0) return '';
		const earth = value / EARTH_TIDE;
		const [ratio, what] =
			earth > 0.05
				? [earth, `the Earth’s own tide at its surface, ${tidal(EARTH_TIDE)}`]
				: [value / PERSON_TIDE, `the tide of a 70 kg person one metre away, ${tidal(PERSON_TIDE)}`];
		if (ratio > 0.95 && ratio < 1.05) return `About the same as ${what}.`;
		return ratio >= 1
			? `${times(ratio)} times ${what}.`
			: `${times(1 / ratio)} times smaller than ${what}.`;
	});
</script>

<div class="reading" data-testid="tidal-reading">
	<div class={['rings', { pair: rings.length > 1 }]}>
		{#each rings as r (r.label)}
			<figure>
				<svg
					viewBox="-50 -50 100 100"
					role="img"
					aria-label="{r.label}: a ring of twelve free particles as the field moves them"
				>
					<circle r={R} class="rest" />
					<path d={r.outline} class="bent" />
					{#each r.particles as p, i (i)}
						<line x1={p.from.x} y1={p.from.y} x2={p.to.x} y2={p.to.y} class={p.kind} />
						<circle cx={p.to.x} cy={p.to.y} r="2.4" class={['mass', p.kind]} />
					{/each}
				</svg>
				<figcaption>
					<strong>{r.label}</strong>
					{#each r.lines as line, i (i)}<span>{line}</span>{/each}
				</figcaption>
			</figure>
		{/each}
	</div>
	<p class="fine">
		Each ring is twelve free particles, {basis
			? 'drawn in its own plane; what moves across that plane is not drawn. A ring facing you turns with the view'
			: 'in the plane of the two largest principal values'}.
		<span class="stretch">Orange</span> moves outward, a stretch; <span class="squeeze">blue</span>
		inward, a squeeze. The dashed circle is the ring at rest. The exaggeration is counted against one
		second of free fall from rest, in which a ring changes by half the tide times its radius.
	</p>

	<h5>Principal values</h5>
	<ul class="values">
		{#each rows as row, i (i)}
			<li>
				<span class="num">{tidal(row.value, true)}</span>
				<span class={row.value < 0 ? 'stretch' : 'squeeze'}
					>{row.value < 0 ? 'stretch' : 'squeeze'}{row.times === 2 ? ', twice' : ''}</span
				>
				<span class="where">{row.direction}</span>
			</li>
		{/each}
	</ul>

	<h5>By source</h5>
	<ul class="sources">
		{#each sources as s (s.label)}
			<li class={{ removed: s.removed }}>
				<span class="name">{s.label}</span>
				<span class="num">{tidal(s.value, true)}</span>
				<span class="share">{s.part === undefined ? 'taken away' : percent(s.part)}</span>
				{#if s.note}<span class="note">{s.note}</span>{/if}
			</li>
		{/each}
	</ul>
	<p class="fine">
		Each source’s largest principal value{#if sources.length > 1}, and its share: its part along the
			whole reading, so the shares add up to 100%. A negative share works against the rest{/if}.
	</p>

	{#if reading.parts}
		<h5>In time</h5>
		<ul class="parts">
			{#each reading.parts as part (part.label)}
				<li>
					<span class="name">{part.label}</span>
					<span class="num">{tidal(part.now)}</span>
					{#if part.most !== undefined}<span class="note"
							>now; at most {tidal(part.most)} over a turn</span
						>{/if}
				</li>
			{/each}
		</ul>
	{/if}

	{#if magnetic}
		<h5>Magnetic part, from moving mass</h5>
		<ul class="parts">
			{#each moving as s (s.label)}
				<li>
					<span class="name">{s.label}</span>
					<span class="num">{tidal(s.magnetic!)}</span>
				</li>
			{/each}
			{#if moving.length > 1}
				<li>
					<span class="name">together</span>
					<span class="num">{tidal(size3(magnetic))}</span>
				</li>
			{/if}
		</ul>
	{/if}

	{#if familiar}
		<h5>For scale</h5>
		<p class="scale">{familiar}</p>
	{/if}

	{#each reading.notes as note (note)}
		<p class="fine">{note}</p>
	{/each}
</div>

<style>
	.reading {
		font: 400 0.76rem/1.45 var(--font-sans);
		color: var(--text);
	}

	h5 {
		margin: 0.95rem 0 0.4rem;
		font: italic 400 0.95rem/1.3 var(--font-serif);
		color: var(--text-dim);
	}

	/* inside the notes' Physics tab the paragraphs of the page have their own margins: these keep theirs */
	div.reading p {
		margin: 0;
	}

	div.reading p.fine {
		margin-top: 0.5rem;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.3rem;
	}

	.num {
		white-space: nowrap;
		font-variant-numeric: tabular-nums;
	}

	.stretch {
		color: var(--accent);
	}

	.squeeze {
		color: var(--accent-2);
	}

	.fine {
		margin-top: 0.5rem;
		color: var(--text-faint);
		font-size: 0.7rem;
		line-height: 1.4;
		text-wrap: pretty;
	}

	/* --- the rings ----------------------------------------------------------------- */

	.rings {
		display: grid;
		gap: 0.6rem;
	}

	.rings.pair {
		grid-template-columns: 1fr 1fr;
	}

	figure {
		margin: 0;
		display: flex;
		align-items: center;
		gap: 0.7rem;
		min-width: 0;
	}

	.pair figure {
		flex-direction: column;
		align-items: stretch;
		gap: 0.3rem;
	}

	svg {
		flex: none;
		width: 6.4rem;
		height: auto;
		border-radius: 10px;
		background: color-mix(in srgb, var(--text) 5%, transparent);
	}

	.pair svg {
		width: 100%;
		max-width: 7.4rem;
		align-self: center;
	}

	figcaption {
		display: grid;
		gap: 0.1rem;
		min-width: 0;
		color: var(--text-dim);
		font-size: 0.7rem;
		line-height: 1.35;
	}

	figcaption strong {
		color: var(--text);
		font-weight: 600;
		font-size: 0.74rem;
	}

	/* the first line under a ring's name is its size */
	figcaption span:first-of-type {
		color: var(--text);
	}

	.rest {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 36%, transparent);
		stroke-width: 0.8;
		stroke-dasharray: 2 2.4;
	}

	.bent {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 66%, transparent);
		stroke-width: 0.9;
	}

	line {
		stroke-width: 1.3;
		stroke-linecap: round;
		stroke: color-mix(in srgb, var(--text) 52%, transparent);
	}

	line.stretch {
		stroke: var(--accent);
	}

	line.squeeze {
		stroke: var(--accent-2);
	}

	.mass {
		fill: color-mix(in srgb, var(--text) 78%, transparent);
		stroke: var(--bg-sunken);
		stroke-width: 0.6;
	}

	.mass.stretch {
		fill: var(--accent);
	}

	.mass.squeeze {
		fill: var(--accent-2);
	}

	/* --- the lists ----------------------------------------------------------------- */

	.values li {
		display: grid;
		grid-template-columns: auto auto 1fr;
		align-items: baseline;
		column-gap: 0.55rem;
	}

	.where {
		color: var(--text-dim);
		min-width: 0;
	}

	.sources li,
	.parts li {
		display: grid;
		grid-template-columns: 1fr auto auto;
		align-items: baseline;
		column-gap: 0.55rem;
	}

	.name {
		min-width: 0;
	}

	.share {
		min-width: 3.1rem;
		text-align: right;
		color: var(--text-dim);
		font-variant-numeric: tabular-nums;
	}

	.note {
		grid-column: 1 / -1;
		color: var(--text-faint);
		font-size: 0.68rem;
		line-height: 1.35;
	}

	.removed .name,
	.removed .num {
		color: var(--text-faint);
	}

	.scale {
		color: var(--text-dim);
	}
</style>
