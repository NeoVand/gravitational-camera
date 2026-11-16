<script lang="ts">
	/**
	 * A compact slider: icon, name and reading on one line, a thin track below.
	 * The native range input does the work, so keyboard and screen readers get a
	 * real slider.
	 */
	import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/svelte';

	interface Props {
		id: string;
		label: string;
		icon?: IconSvgElement;
		value: number;
		min: number;
		max: number;
		step?: number;
		/** The reading shown beside the name. */
		readout: string;
		/** Words for the two ends of the track. */
		ends?: [string, string];
	}

	let {
		id,
		label,
		icon,
		value = $bindable(),
		min,
		max,
		step = 0.01,
		readout,
		ends
	}: Props = $props();

	const fill = $derived(Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100)));
</script>

<div class="slider">
	<div class="head">
		<label for={id}>
			{#if icon}<HugeiconsIcon {icon} size={15} strokeWidth={1.7} />{/if}
			{label}
		</label>
		<output for={id}>{readout}</output>
	</div>
	<input {id} type="range" {min} {max} {step} bind:value style:--fill="{fill}%" />
	{#if ends}
		<div class="ends" aria-hidden="true"><span>{ends[0]}</span><span>{ends[1]}</span></div>
	{/if}
</div>

<style>
	.slider {
		display: grid;
		gap: 0.35rem;
	}

	.head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.8rem;
	}

	label {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		color: var(--text);
		font-size: 0.8rem;
		white-space: nowrap;
	}

	label :global(svg) {
		color: var(--text-dim);
		align-self: center;
	}

	output {
		font: 400 0.72rem/1.2 var(--font-mono);
		color: var(--accent);
		text-align: right;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		min-width: 0;
	}

	input {
		appearance: none;
		width: 100%;
		height: 18px;
		margin: 0;
		background: transparent;
		cursor: pointer;
	}

	input:focus-visible {
		outline: none;
	}

	input::-webkit-slider-runnable-track {
		height: 3px;
		border-radius: 3px;
		background: linear-gradient(
			to right,
			var(--accent) var(--fill),
			rgb(255 255 255 / 0.14) var(--fill)
		);
	}

	input::-moz-range-track {
		height: 3px;
		border-radius: 3px;
		background: rgb(255 255 255 / 0.14);
	}

	input::-moz-range-progress {
		height: 3px;
		border-radius: 3px;
		background: var(--accent);
	}

	input::-webkit-slider-thumb {
		appearance: none;
		width: 14px;
		height: 14px;
		margin-top: -5.5px;
		border-radius: 50%;
		background: #f4f1ea;
		border: 0;
		box-shadow:
			0 0 0 4px rgb(232 164 90 / 0),
			0 1px 4px rgb(0 0 0 / 0.5);
		transition: box-shadow 0.15s;
	}

	input::-moz-range-thumb {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: #f4f1ea;
		border: 0;
		box-shadow: 0 1px 4px rgb(0 0 0 / 0.5);
	}

	input:hover::-webkit-slider-thumb,
	input:focus-visible::-webkit-slider-thumb {
		box-shadow:
			0 0 0 4px rgb(232 164 90 / 0.28),
			0 1px 4px rgb(0 0 0 / 0.5);
	}

	input:focus-visible::-moz-range-thumb {
		box-shadow: 0 0 0 4px rgb(232 164 90 / 0.35);
	}

	.ends {
		display: flex;
		justify-content: space-between;
		font-size: 0.66rem;
		color: var(--text-faint);
		margin-top: -0.2rem;
	}
</style>
