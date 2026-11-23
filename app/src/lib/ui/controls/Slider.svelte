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
		/** A value worth marking on the track, with a few words under it. */
		mark?: { at: number; label: string };
		/**
		 * Values worth going to: a tick for each under the track. A tick's name shows when it is pointed at, focused
		 * or current; pressing it moves the slider there.
		 */
		marks?: { at: number; label: string }[];
		/** What the ticks are, said under them while none is pointed at or current. */
		marksHint?: string;
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
		ends,
		mark,
		marks = [],
		marksHint = 'the ticks mark where the field changes'
	}: Props = $props();

	const fill = $derived(Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100)));
	/** Where the mark falls along the track, 0 to 1, if it is on it. */
	const markAt = $derived(
		mark && mark.at >= min && mark.at <= max ? (mark.at - min) / (max - min) : undefined
	);

	/** The marks that fall on the track, in order, each with its place along it, 0 to 1. */
	const ticks = $derived(
		marks
			.filter((m) => m.at >= min && m.at <= max)
			.sort((a, b) => a.at - b.at)
			.map((m) => ({ ...m, place: (m.at - min) / (max - min) }))
	);
	/** The tick the slider stands on, if any: within a step of it. */
	const standing = $derived(ticks.find((t) => Math.abs(t.at - value) <= step * 0.75));
	let pointed: string | undefined = $state();

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
	{#if ticks.length}
		<div class="ticks" role="group" aria-label="Places worth going to on “{label}”">
			{#each ticks as tick (tick.at)}
				<button
					type="button"
					class={{ on: tick === standing }}
					style:--at={tick.place}
					aria-label="Go to {tick.label}"
					aria-pressed={tick === standing}
					title={tick.label}
					onclick={() => (value = tick.at)}
					onpointerenter={() => (pointed = tick.label)}
					onpointerleave={() => (pointed = undefined)}
					onfocus={() => (pointed = tick.label)}
					onblur={() => (pointed = undefined)}
				></button>
			{/each}
		</div>
	{/if}
	{#if ends}
		<div class="ends" aria-hidden="true"><span>{ends[0]}</span><span>{ends[1]}</span></div>
	{/if}
	{#if ticks.length}
		<p class="named" aria-live="polite">
			{pointed ?? standing?.label ?? marksHint}
		</p>
	{/if}
	{#if mark && markAt !== undefined}
		<div class="mark" style:--at={markAt}>
			<i></i>
			<span style:--shift="{-100 * markAt}%">{mark.label}</span>
		</div>
	{/if}
</div>

<style>
	.slider {
		display: grid;
		/* a long reading is cut short; it never widens the panel */
		grid-template-columns: minmax(0, 1fr);
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

	/* The track and thumb take their colours from the surroundings: the ink of the
	   theme by default; a setting may restyle them through --slider-track,
	   --slider-thumb and --slider-shadow. */
	input::-webkit-slider-runnable-track {
		height: 3px;
		border-radius: 3px;
		background: linear-gradient(
			to right,
			var(--accent) var(--fill),
			var(--slider-track, color-mix(in srgb, var(--text) 16%, transparent)) var(--fill)
		);
	}

	input::-moz-range-track {
		height: 3px;
		border-radius: 3px;
		background: var(--slider-track, color-mix(in srgb, var(--text) 16%, transparent));
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
		background: var(--slider-thumb, var(--text));
		border: 0;
		box-shadow:
			0 0 0 4px transparent,
			var(--slider-shadow, 0 1px 4px rgb(0 0 0 / 0.35));
		transition: box-shadow 0.15s;
	}

	input::-moz-range-thumb {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: var(--slider-thumb, var(--text));
		border: 0;
		box-shadow: var(--slider-shadow, 0 1px 4px rgb(0 0 0 / 0.35));
	}

	input:hover::-webkit-slider-thumb,
	input:focus-visible::-webkit-slider-thumb {
		box-shadow:
			0 0 0 4px color-mix(in srgb, var(--accent) 30%, transparent),
			var(--slider-shadow, 0 1px 4px rgb(0 0 0 / 0.35));
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

	/* places worth going to: a row of ticks under the track, each a button, and the name of the one in hand */
	.ticks {
		--half: 7px;
		position: relative;
		height: 0.95rem;
		margin-top: -0.45rem;
	}

	.ticks button {
		position: absolute;
		top: 0;
		left: calc(var(--half) + (100% - 2 * var(--half)) * var(--at));
		translate: -50% 0;
		width: 0.85rem;
		height: 0.95rem;
		padding: 0;
		border: 0;
		background: none;
		cursor: pointer;
	}

	.ticks button::before {
		content: '';
		position: absolute;
		left: 50%;
		top: 0.1rem;
		translate: -50% 0;
		width: 2px;
		height: 0.6rem;
		border-radius: 1px;
		background: var(--text-faint);
		transition:
			background-color 0.12s,
			height 0.12s;
	}

	.ticks button:hover::before,
	.ticks button:focus-visible::before,
	.ticks button.on::before {
		background: var(--accent);
		height: 0.75rem;
	}

	.ticks button:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 1px;
		border-radius: 3px;
	}

	.named {
		margin: -0.2rem 0 0;
		min-height: 1.3em;
		font-size: 0.66rem;
		line-height: 1.3;
		color: var(--text-dim);
	}

	/* a finger needs a wider target */
	@media (pointer: coarse) {
		.ticks {
			height: 1.4rem;
		}

		.ticks button {
			width: 1.3rem;
			height: 1.4rem;
		}

		.ticks button::before {
			top: 0.25rem;
		}
	}

	/* a marked value: a tick that reaches up to the track, and its words below, kept inside the track's ends */
	.mark {
		--half: 7px;
		position: relative;
		margin-top: -0.15rem;
		font-size: 0.66rem;
		line-height: 1.3;
		color: var(--text-dim);
	}

	.mark i {
		position: absolute;
		left: calc(var(--half) + (100% - 2 * var(--half)) * var(--at));
		top: -0.62rem;
		width: 1px;
		height: 0.6rem;
		background: var(--text-dim);
	}

	.mark span {
		display: inline-block;
		margin-left: calc(var(--half) + (100% - 2 * var(--half)) * var(--at));
		translate: var(--shift) 0;
		white-space: nowrap;
	}

	/* fingers need a larger target than a pointer */
	@media (pointer: coarse) {
		.mark {
			--half: 11px;
		}

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
