<script lang="ts" generics="T extends string">
	/** A choice between a few views, each with an icon. */
	import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/svelte';

	interface Option {
		value: T;
		label: string;
		icon: IconSvgElement;
	}

	interface Props {
		options: Option[];
		value: T;
		/** What the choice is about, for screen readers. */
		label: string;
	}

	let { options, value = $bindable(), label }: Props = $props();
</script>

<div class="segmented" role="group" aria-label={label}>
	{#each options as option (option.value)}
		<button
			type="button"
			aria-pressed={value === option.value}
			onclick={() => (value = option.value)}
		>
			<HugeiconsIcon icon={option.icon} size={16} strokeWidth={1.7} />
			{option.label}
		</button>
	{/each}
</div>

<style>
	.segmented {
		display: flex;
		padding: 3px;
		gap: 3px;
		border-radius: 11px;
		background: rgb(0 0 0 / 0.35);
		border: 1px solid rgb(255 255 255 / 0.07);
	}

	button {
		flex: 1;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		padding: 0.5rem 0.6rem;
		border: 0;
		border-radius: 8px;
		background: transparent;
		color: var(--text-dim);
		font-size: 0.76rem;
		white-space: nowrap;
		cursor: pointer;
		transition:
			background-color 0.15s,
			color 0.15s;
	}

	button:hover {
		color: var(--text);
	}

	button[aria-pressed='true'] {
		background: rgb(255 255 255 / 0.1);
		color: var(--text);
		box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.08);
	}

	button:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 1px;
	}
</style>
