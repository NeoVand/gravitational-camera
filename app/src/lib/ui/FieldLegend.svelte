<script lang="ts">
	/**
	 * The key to the "Tidal field" view, the same in every demo: where the points lie, what the strokes and the
	 * colour mean, and the strengths at the two ends of the scale, in s⁻². In brief it is a line or two for the foot
	 * of the sidebar, which says where the points lie; in full, the Key tab, with the scale drawn.
	 */
	import {
		fieldMark,
		scaleEnds,
		strengthRamp,
		toDisplay,
		STRETCH,
		SQUEEZE,
		type FieldCamera,
		type Rgb
	} from '../pixel/field-view';
	import { fieldLook } from './field-look.svelte';
	import { tidal } from './format';

	interface Props {
		/** Where the points lie: "on a sphere 3.5 m about the camera". */
		where: string;
		/** The median strength over the picture, s⁻²: what the logarithmic scale is set against. */
		reference: number;
		/** The whole key, for a tab of its own. */
		full?: boolean;
	}

	let { where, reference, full = false }: Props = $props();

	const ends = $derived(scaleEnds(reference, fieldLook.shift));
	const css = (c: Rgb) => `rgb(${c.map((v) => Math.round(255 * toDisplay(v))).join(' ')})`;

	// The wash at eleven strengths along the scale, over black, for a stretch across the picture, up and down it,
	// and along the line of sight: the three rows of the scale as drawn.
	const camera: FieldCamera = {
		right: [1, 0, 0],
		up: [0, 1, 0],
		forward: [0, 0, 1],
		tanX: 1,
		tanY: 1
	};
	const along = (axis: 0 | 1 | 2, size: number) =>
		[0, 1, 2].map((i) => [0, 1, 2].map((j) => (i === j ? (i === axis ? -2 : 1) * size : 0)));
	const ramp = (axis: 0 | 1 | 2) => {
		const stops = Array.from({ length: 11 }, (_, k) => {
			// sqrt(3) is the size of a tensor (-2, 1, 1)
			const size = 10 ** (-2 + (2.6 * k) / 10) / Math.sqrt(3);
			const mark = fieldMark(along(axis, size), camera, 1, { ...fieldLook, shift: 0 });
			return `${css(mark.tone.map((t) => t * mark.cover) as Rgb)} ${10 * k}%`;
		});
		return `linear-gradient(to right, ${stops.join(', ')})`;
	};
	const rows = $derived(
		fieldLook.colour === 'direction'
			? [
					{ name: 'stretch across the picture', paint: ramp(0) },
					{ name: 'stretch up and down', paint: ramp(1) },
					{ name: 'stretch along your line of sight', paint: ramp(2) }
				]
			: [
					{
						name: fieldLook.colour === 'strength' ? 'any direction' : 'outside matter',
						paint: ramp(1)
					}
				]
	);
</script>

{#snippet colours()}
	{#if fieldLook.colour === 'direction'}
		Colour is its direction: <span class="r">red</span> across, <span class="g">green</span> up and
		down, <span class="b">blue</span> toward you.
	{:else if fieldLook.colour === 'strength'}
		Colour is the strength, from <span style:color={css(strengthRamp(0.35))}>violet</span> to
		<span style:color={css(strengthRamp(1))}>yellow</span>.
	{:else}
		<span style:color={css(STRETCH)}>Orange</span> where stretch leads,
		<span style:color={css(SQUEEZE)}>blue</span> where squeeze does.
	{/if}
{/snippet}

{#if full}
	<div class="key" data-testid="field-key">
		<p>
			Every pixel of the gravity side is coloured by the tidal tensor at its own point, the part
			that only says how dense the matter there is left out.
			{#if fieldLook.strokes}
				Each fine stroke lies along the stretch at its cell’s centre, as it crosses the picture: a
				stretch along your line of sight has no stroke.
			{/if}
			{@render colours()}
		</p>
		<p>
			Strength, the wash’s brightness and cover{fieldLook.strokes
				? ' and the strokes’ length'
				: ''}: logarithmic, from {tidal(ends.none)} to {tidal(ends.full)}. Half the picture is
			stronger than
			{tidal(reference)}.
		</p>
		<div class="scale" aria-hidden="true">
			{#each rows as row (row.name)}
				<i style:background={row.paint}></i>
				<span>{row.name}</span>
			{/each}
			<div class="ends"><span>{tidal(ends.none)}</span><span>{tidal(ends.full)}</span></div>
		</div>
		<p class="fine">
			The strengths are true; the picture’s lengths and brightness are not to scale. “Tidal field”
			under Controls sets how it is drawn.
		</p>
	</div>
{:else}
	<p class="brief" data-testid="field-legend">
		<strong>Tidal field {where}.</strong>
		<span class="how">
			{#if fieldLook.colour === 'direction'}
				Colour is the direction of the stretch.
			{:else if fieldLook.colour === 'strength'}
				Colour is the strength.
			{:else}
				Orange where stretch leads, blue where squeeze does.
			{/if}
		</span>
		Strength: {tidal(ends.none)} to {tidal(ends.full)}, logarithmic.
	</p>
{/if}

<style>
	p {
		margin: 0 0 0.8rem;
		text-wrap: pretty;
		font-variant-numeric: tabular-nums;
	}

	.brief {
		margin: 0;
	}

	/* on a phone the sheet is short: the place and the scale; the Key tab has the rest */
	@media (max-width: 720px) {
		.how {
			display: none;
		}
	}

	strong {
		font-weight: 600;
		color: #fff;
	}

	/* the tones of the wash itself, as muted as it is */
	.r {
		color: rgb(240 150 150);
	}

	.g {
		color: rgb(150 225 150);
	}

	.b {
		color: rgb(160 170 250);
	}

	.scale {
		display: grid;
		gap: 0.25rem;
		margin: 1rem 0;
		font-size: 0.72rem;
		color: var(--text-faint);
	}

	.scale i {
		display: block;
		height: 0.7rem;
		border-radius: 2px;
		border: 1px solid rgb(255 255 255 / 0.16);
	}

	.scale span {
		margin-bottom: 0.3rem;
	}

	.ends {
		display: flex;
		justify-content: space-between;
		font: 400 0.72rem/1.3 var(--font-mono);
		color: var(--text-dim);
	}

	.ends span {
		margin: 0;
	}

	.fine {
		margin: 0;
		font-size: 0.76rem;
		color: var(--text-faint);
	}
</style>
