<script lang="ts">
	/** An on/off chip with an icon. A real checkbox inside keeps it accessible. */
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
	<HugeiconsIcon {icon} size={17} strokeWidth={1.6} />
	<span>{label}</span>
</label>

<style>
	.toggle {
		position: relative;
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		gap: 0.3rem;
		padding: 0.55rem 0.4rem 0.45rem;
		border-radius: 10px;
		border: 1px solid var(--line);
		background: color-mix(in srgb, var(--text) 4%, transparent);
		color: var(--text-dim);
		font-size: 0.68rem;
		line-height: 1;
		/* a name of two words may take two lines */
		text-align: center;
		cursor: pointer;
		user-select: none;
		transition:
			color 0.15s,
			background-color 0.15s,
			border-color 0.15s;
	}

	.toggle:hover {
		color: var(--text);
		border-color: var(--line-strong);
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
</style>
