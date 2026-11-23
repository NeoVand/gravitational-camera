<script lang="ts">
	/**
	 * The controls of the "Tidal field" view, the same in every demo: the demo's own slice first, then how the view
	 * looks. The look is one for all demos and is kept (field-look); "Reset look" brings back the one it starts with.
	 */
	import type { Snippet } from 'svelte';
	import {
		ArrowExpand01Icon,
		ArrowTurnBackwardIcon,
		ChartIncreaseIcon,
		Compass01Icon,
		ContrastIcon,
		DashedLine01Icon,
		GridIcon,
		RulerIcon,
		SolidLine01Icon,
		TransparencyIcon
	} from '@hugeicons/core-free-icons';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { FIELD_CELL, scaleEnds, type FieldLook } from '../pixel/field-view';
	import Group from './controls/Group.svelte';
	import Segmented from './controls/Segmented.svelte';
	import Slider from './controls/Slider.svelte';
	import { fieldLook, keepLook, lookChanged, resetLook } from './field-look.svelte';
	import { tideText } from './tide-text';

	interface Props {
		/** The median strength over the picture, s⁻²: what the scale is set against. */
		reference: number;
		/** The demo's own controls of the view: its slice. */
		children?: Snippet;
	}

	let { reference, children }: Props = $props();

	/** Set one part of the look, and keep it. */
	function set<K extends keyof FieldLook>(name: K, value: FieldLook[K]) {
		fieldLook[name] = value;
		keepLook();
	}

	const ends = $derived(scaleEnds(reference, fieldLook.shift));
	const percent = (x: number) => `${Math.round(100 * x)}%`;
</script>

<Group title="Tidal field">
	{@render children?.()}
	<div class="choice">
		<div class="row">
			<span class="name" id="look-colour">Colour by</span>
			<button type="button" class="reset" disabled={!lookChanged()} onclick={resetLook}>
				<HugeiconsIcon icon={ArrowTurnBackwardIcon} size={13} strokeWidth={1.8} /> Reset look
			</button>
		</div>
		<Segmented
			label="What the wash is coloured by"
			options={[
				{ value: 'direction', label: 'Direction', icon: Compass01Icon },
				{ value: 'strength', label: 'Strength', icon: ChartIncreaseIcon },
				{ value: 'sign', label: 'Stretch or squeeze', icon: ArrowExpand01Icon, wide: true }
			]}
			bind:value={() => fieldLook.colour, (v) => set('colour', v)}
		/>
	</div>
	<Slider
		id="look-contrast"
		label="Contrast"
		icon={ContrastIcon}
		min={0.4}
		max={1.4}
		step={0.02}
		bind:value={() => fieldLook.contrast, (v) => set('contrast', v)}
		readout={percent(fieldLook.contrast)}
	/>
	<Slider
		id="look-scale"
		label="Strength scale"
		icon={RulerIcon}
		min={-2}
		max={2}
		step={0.05}
		bind:value={() => fieldLook.shift, (v) => set('shift', v)}
		readout={tideText(ends.full)}
		ends={['tame the strong', 'bring up the weak']}
	/>
	<Slider
		id="look-opacity"
		label="Wash opacity"
		icon={TransparencyIcon}
		min={0}
		max={1}
		step={0.01}
		bind:value={() => fieldLook.opacity, (v) => set('opacity', v)}
		readout={percent(fieldLook.opacity)}
	/>
	<details>
		<summary>
			<span>Strokes</span>
			<span class="state">
				{fieldLook.strokes ? `one to ${(FIELD_CELL / fieldLook.density).toFixed(0)} px` : 'off'}
			</span>
		</summary>
		<div class="strokes">
			<label class="check">
				<input type="checkbox" bind:checked={() => fieldLook.strokes, (v) => set('strokes', v)} />
				Draw strokes along the stretch
			</label>
			{#if fieldLook.strokes}
				<Slider
					id="look-density"
					label="Density"
					icon={GridIcon}
					min={0.5}
					max={2}
					step={0.05}
					bind:value={() => fieldLook.density, (v) => set('density', v)}
					readout="one to {(FIELD_CELL / fieldLook.density).toFixed(0)} px"
				/>
				<Slider
					id="look-length"
					label="Length"
					icon={DashedLine01Icon}
					min={0.3}
					max={1.19}
					step={0.01}
					bind:value={() => fieldLook.length, (v) => set('length', v)}
					readout="{percent(0.84 * fieldLook.length)} of a cell"
				/>
				<Slider
					id="look-weight"
					label="Weight"
					icon={SolidLine01Icon}
					min={0.6}
					max={2.5}
					step={0.05}
					bind:value={() => fieldLook.weight, (v) => set('weight', v)}
					readout="{(1.6 * fieldLook.weight).toFixed(1)} px"
				/>
				<label class="check">
					<input
						type="checkbox"
						bind:checked={() => fieldLook.edge > 0, (v) => set('edge', v ? 0.5 : 0)}
					/>
					A hairline of shade about each stroke
				</label>
			{/if}
		</div>
	</details>
</Group>

<style>
	.choice {
		display: grid;
		gap: 0.4rem;
	}

	.name,
	summary {
		font-size: 0.82rem;
		color: var(--text);
	}

	summary {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 0.6rem;
		padding: 0.15rem 0;
		cursor: pointer;
		list-style: none;
	}

	summary::-webkit-details-marker {
		display: none;
	}

	summary > span:first-child::before {
		content: '▸';
		display: inline-block;
		width: 1em;
		color: var(--text-faint);
		transition: rotate 0.12s;
	}

	details[open] summary > span:first-child::before {
		rotate: 90deg;
	}

	summary:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
		border-radius: 4px;
	}

	/* as the sliders' readings are: the text's own face, figures in columns */
	.state {
		font: 400 0.74rem/1.2 var(--font-sans);
		font-variant-numeric: tabular-nums;
		color: var(--accent);
	}

	.strokes {
		display: grid;
		gap: 0.85rem;
		padding-top: 0.7rem;
	}

	.check {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.78rem;
		color: var(--text-dim);
		cursor: pointer;
	}

	.check input {
		accent-color: var(--accent);
		width: 0.95rem;
		height: 0.95rem;
	}

	.row {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.reset {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		padding: 0.25rem 0.5rem;
		border-radius: 7px;
		border: 1px solid var(--line);
		background: color-mix(in srgb, var(--text) 5%, transparent);
		color: var(--text-dim);
		font: 400 0.7rem/1 var(--font-sans);
		cursor: pointer;
	}

	.reset:hover:not(:disabled) {
		background: color-mix(in srgb, var(--text) 10%, transparent);
		color: var(--text);
	}

	.reset:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.reset:disabled {
		opacity: 0.4;
		cursor: default;
	}
</style>
