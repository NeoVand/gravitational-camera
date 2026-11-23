<script lang="ts">
	/**
	 * An on/off chip with an icon. A real checkbox inside keeps it accessible. In a grid of several it is a tile,
	 * the icon over the name; given a row of its own (or half of one) it lies flat, the name beside the icon and a
	 * small switch at the end, so that a lone toggle reads as one and not as a button.
	 */
	import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/svelte';

	interface Props {
		icon: IconSvgElement;
		label: string;
		checked: boolean;
		/** A longer explanation, shown on hover. */
		hint?: string;
	}

	let { icon, label, checked = $bindable(), hint }: Props = $props();
</script>

<label class={['toggle', { on: checked }]} title={hint}>
	<input type="checkbox" bind:checked />
	<span class="face">
		<HugeiconsIcon {icon} size={17} strokeWidth={1.6} />
		<span class="name">{label}</span>
		<span class="switch" aria-hidden="true"></span>
	</span>
</label>

<style>
	.toggle {
		position: relative;
		display: block;
		container-type: inline-size;
		border-radius: 10px;
		border: 1px solid var(--line);
		background: color-mix(in srgb, var(--text) 4%, transparent);
		color: var(--text-dim);
		cursor: pointer;
		user-select: none;
		transition:
			color 0.15s,
			background-color 0.15s,
			border-color 0.15s;
	}

	/* a tile: the icon over the name, which may take two lines */
	.face {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.3rem;
		height: 100%;
		padding: 0.55rem 0.3rem 0.45rem;
		font-size: 0.7rem;
		line-height: 1.1;
		text-align: center;
	}

	.switch {
		display: none;
	}

	/* flat, where there is room: as tall as the other controls, with a switch that shows the state */
	@container (min-width: 8.5rem) {
		.face {
			flex-direction: row;
			justify-content: flex-start;
			gap: 0.5rem;
			min-height: calc(var(--control-height, 2.55rem) - 2px);
			padding: 0.35rem 0.7rem;
			font-size: 0.78rem;
			line-height: 1.2;
			text-align: left;
		}

		.name {
			flex: 1;
			min-width: 0;
		}

		.switch {
			display: block;
			position: relative;
			flex: none;
			width: 1.9rem;
			height: 1.1rem;
			border-radius: 999px;
			background: color-mix(in srgb, var(--text) 16%, transparent);
			transition: background-color 0.15s;
		}

		.switch::after {
			content: '';
			position: absolute;
			top: 2px;
			left: 2px;
			width: calc(1.1rem - 4px);
			height: calc(1.1rem - 4px);
			border-radius: 50%;
			background: var(--text);
			box-shadow: 0 1px 3px rgb(0 0 0 / 0.3);
			transition: translate 0.15s;
		}

		.on .switch {
			background: var(--accent);
		}

		.on .switch::after {
			translate: 0.8rem 0;
			background: var(--bg-raised);
		}
	}

	@media (hover: hover) {
		.toggle:hover {
			color: var(--text);
			border-color: var(--line-strong);
		}
	}

	.toggle.on {
		color: var(--text);
		background: color-mix(in srgb, var(--accent) 13%, transparent);
		border-color: color-mix(in srgb, var(--accent) 55%, transparent);
	}

	.toggle.on :global(svg) {
		color: var(--accent);
	}

	input {
		position: absolute;
		opacity: 0;
		inset: 0;
		margin: 0;
		cursor: pointer;
	}

	.toggle:has(input:focus-visible) {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	@media (prefers-reduced-motion: reduce) {
		.switch,
		.switch::after {
			transition: none;
		}
	}
</style>
