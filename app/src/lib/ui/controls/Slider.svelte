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

	/**
	 * Touch: the value follows the finger anywhere along the track, not only
	 * from the thumb (WebKit's own slider moves only when the thumb itself is
	 * grabbed). A drag that starts mostly vertical is left to scroll the panel;
	 * a tap sets the value where it lands. The mouse keeps the native slider.
	 */
	let touch: { id: number; x: number; y: number; sliding: boolean } | undefined;

	function setFrom(input: HTMLInputElement, clientX: number) {
		const r = input.getBoundingClientRect();
		const thumb = parseFloat(getComputedStyle(input).getPropertyValue('--thumb')) || 14;
		const t = Math.max(0, Math.min(1, (clientX - r.left - thumb / 2) / (r.width - thumb)));
		const steps = Math.round((t * (max - min)) / step);
		value = Math.max(min, Math.min(max, min + steps * step));
	}

	function down(e: PointerEvent) {
		if (e.pointerType === 'mouse') return;
		touch = { id: e.pointerId, x: e.clientX, y: e.clientY, sliding: false };
	}

	function move(e: PointerEvent) {
		if (!touch || e.pointerId !== touch.id) return;
		const input = e.currentTarget as HTMLInputElement;
		if (!touch.sliding) {
			const dx = Math.abs(e.clientX - touch.x);
			const dy = Math.abs(e.clientY - touch.y);
			if (dx < 4 || dy > dx) return;
			touch.sliding = true;
			input.setPointerCapture(e.pointerId);
		}
		e.preventDefault();
		setFrom(input, e.clientX);
	}

	function up(e: PointerEvent) {
		if (!touch || e.pointerId !== touch.id) return;
		const input = e.currentTarget as HTMLInputElement;
		const moved = Math.hypot(e.clientX - touch.x, e.clientY - touch.y);
		if (touch.sliding || moved < 8) setFrom(input, e.clientX);
		touch = undefined;
	}
</script>

<div class="slider">
	<div class="head">
		<label for={id}>
			{#if icon}<HugeiconsIcon {icon} size={15} strokeWidth={1.7} />{/if}
			{label}
		</label>
		<output for={id}>{readout}</output>
	</div>
	<input
		{id}
		type="range"
		{min}
		{max}
		{step}
		bind:value
		style:--fill="{fill}%"
		onpointerdown={down}
		onpointermove={move}
		onpointerup={up}
		onpointercancel={() => (touch = undefined)}
	/>
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
		--thumb: 14px;
		appearance: none;
		width: 100%;
		height: 18px;
		margin: 0;
		background: transparent;
		cursor: pointer;
		/* vertical swipes still scroll the panel; sideways ones move the slider */
		touch-action: pan-y;
	}

	input:focus-visible {
		outline: none;
	}

	/* The track and thumb take their colours from the surroundings: pale on the
	   demos' dark glass by default, the page's ink in the paper. */
	input::-webkit-slider-runnable-track {
		height: 3px;
		border-radius: 3px;
		background: linear-gradient(
			to right,
			var(--accent) var(--fill),
			var(--slider-track, rgb(255 255 255 / 0.14)) var(--fill)
		);
	}

	input::-moz-range-track {
		height: 3px;
		border-radius: 3px;
		background: var(--slider-track, rgb(255 255 255 / 0.14));
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
		background: var(--slider-thumb, #f4f1ea);
		border: 0;
		box-shadow:
			0 0 0 4px rgb(232 164 90 / 0),
			var(--slider-shadow, 0 1px 4px rgb(0 0 0 / 0.5));
		transition: box-shadow 0.15s;
	}

	input::-moz-range-thumb {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: var(--slider-thumb, #f4f1ea);
		border: 0;
		box-shadow: var(--slider-shadow, 0 1px 4px rgb(0 0 0 / 0.5));
	}

	input:hover::-webkit-slider-thumb,
	input:focus-visible::-webkit-slider-thumb {
		box-shadow:
			0 0 0 4px color-mix(in srgb, var(--accent) 30%, transparent),
			var(--slider-shadow, 0 1px 4px rgb(0 0 0 / 0.5));
	}

	input:focus-visible::-moz-range-thumb {
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 35%, transparent);
	}

	.ends {
		display: flex;
		justify-content: space-between;
		font-size: 0.66rem;
		color: var(--text-faint);
		margin-top: -0.2rem;
	}

	/* fingers need a larger target than a pointer */
	@media (pointer: coarse) {
		input {
			--thumb: 22px;
			height: 32px;
		}

		input::-webkit-slider-thumb {
			width: 22px;
			height: 22px;
			margin-top: -9.5px;
		}

		input::-moz-range-thumb {
			width: 22px;
			height: 22px;
		}
	}
</style>
