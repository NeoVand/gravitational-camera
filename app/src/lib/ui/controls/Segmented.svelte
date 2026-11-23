<script lang="ts" generics="T extends string">
	/** A choice between a few views, each with an icon. */
	import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/svelte';

	interface Option {
		value: T;
		label: string;
		icon: IconSvgElement;
		/** Takes a whole row of its own. */
		wide?: boolean;
	}

	interface Props {
		options: Option[];
		value: T;
		/** What the choice is about, for screen readers. */
		label: string;
	}

	let { options, value = $bindable(), label }: Props = $props();

	// the columns are counted over the options that share rows
	const narrow = $derived(options.filter((o) => !o.wide));
</script>

<div
	class="segmented"
	role="group"
	aria-label={label}
	style:--columns={narrow.length > 3 ? 2 : narrow.length}
>
	{#each options as option (option.value)}
		<button
			type="button"
			class={{ wide: option.wide }}
			aria-pressed={value === option.value}
			onclick={() => (value = option.value)}
		>
			<HugeiconsIcon icon={option.icon} size={16} strokeWidth={1.7} />
			{option.label}
		</button>
	{/each}
</div>

<style>
	/* one row for up to three choices, two columns beyond, so that they always fit the panel */
	.segmented {
		display: grid;
		grid-template-columns: repeat(var(--columns), minmax(0, 1fr));
		padding: 3px;
		gap: 3px;
		border-radius: 11px;
		/* a groove a shade off the ground it sits on, whichever theme */
		background: color-mix(in srgb, var(--text) 6%, transparent);
		border: 1px solid var(--line);
	}

	button {
		min-width: 0;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		/* as tall, groove and all, as a row of actions (Group) */
		min-height: calc(var(--control-height, 2.55rem) - 8px);
		padding: 0.3rem 0.6rem;
		border: 0;
		border-radius: 8px;
		background: transparent;
		color: var(--text-dim);
		font-size: 0.78rem;
		line-height: 1.2;
		white-space: nowrap;
		cursor: pointer;
		transition:
			background-color 0.15s,
			color 0.15s;
	}

	button.wide {
		grid-column: 1 / -1;
	}

	@media (hover: hover) {
		button:hover {
			color: var(--text);
		}
	}

	button[aria-pressed='true'] {
		background: var(--bg-raised);
		color: var(--text);
		box-shadow: inset 0 0 0 1px var(--line-strong);
	}

	button[aria-pressed='true'] :global(svg) {
		color: var(--accent);
	}

	button:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 1px;
	}
</style>
