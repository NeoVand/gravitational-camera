<script lang="ts">
	/**
	 * The name of one side of a split picture, a pill at its foot beside the divider. Where that side is too narrow
	 * for the whole name, the name drops its last qualifier (" · …"), then the next, and at last its words, keeping
	 * the icon: it is never cut off in the middle of a word.
	 */
	import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/svelte';

	interface Props {
		icon: IconSvgElement;
		label: string;
		side: 'left' | 'right';
		/** Where the divider stands, 0 to 1. */
		split: number;
		/** The width of the whole picture, CSS pixels; 0 until it is laid out. */
		width: number;
	}

	let { icon, label, side, split, width }: Props = $props();

	/**
	 * The name, then shorter and shorter forms of it, and last the icon alone. A qualifier with a value after a comma
	 * ("primordial, 0.905 K") first gives up its words and keeps the value.
	 */
	const forms = $derived.by(() => {
		const parts = label.split(' · ');
		const all = [label];
		for (let n = parts.length; n > 1; n--) {
			const last = parts[n - 1];
			const comma = last.lastIndexOf(', ');
			if (comma >= 0) all.push([...parts.slice(0, n - 1), last.slice(comma + 2)].join(' · '));
			all.push(parts.slice(0, n - 1).join(' · '));
		}
		return [...new Set([...all, ''])];
	});
	/** The width each form takes as a pill, measured off screen. */
	let widths: number[] = $state([]);
	/** The room beside the divider, less the margins either side of the pill. */
	const room = $derived((side === 'left' ? split : 1 - split) * width - 28);
	const measured = $derived(forms.every((_, i) => (widths[i] ?? 0) > 0));
	const shown = $derived(
		width > 0 && measured ? (forms.find((_, i) => widths[i] <= room) ?? '') : label
	);
</script>

<span
	class={['tag', side]}
	style:left={side === 'right' ? `calc(${split * 100}% + 14px)` : undefined}
	style:right={side === 'left' ? `calc(${(1 - split) * 100}% + 14px)` : undefined}
	style:max-width="calc({(side === 'left' ? split : 1 - split) * 100}% - 28px)"
	aria-label={shown === label ? undefined : label}
>
	<HugeiconsIcon {icon} size={13} strokeWidth={2} />{#if shown}<span class="text">{shown}</span
		>{/if}
</span>
<span class="measure" aria-hidden="true">
	{#each forms as form, i (form)}
		<span class="pill" bind:offsetWidth={widths[i]}>
			<HugeiconsIcon {icon} size={13} strokeWidth={2} />{#if form}<span>{form}</span>{/if}
		</span>
	{/each}
</span>

<style>
	/* The pills sit at the foot of the picture, clear of page headers; a page with controls along the bottom raises
	   them with --tag-inset. The picture is always dark, whichever the theme, and so are they. */
	.tag,
	.pill {
		display: inline-flex;
		align-items: center;
		gap: 0.45em;
		font: italic 400 0.92rem/1 var(--font-serif);
		padding: 0.45em 0.7em;
		border: 1px solid rgb(255 255 255 / 0.14);
		border-radius: 999px;
		white-space: nowrap;
	}

	.tag {
		position: absolute;
		bottom: var(--tag-inset, 14px);
		color: rgb(255 255 255 / 0.82);
		background: rgb(33 25 16 / 0.6);
		backdrop-filter: blur(6px);
		pointer-events: none;
	}

	.tag .text {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.tag :global(svg),
	.pill :global(svg) {
		flex: none;
	}

	.measure {
		position: absolute;
		top: 0;
		left: 0;
		visibility: hidden;
		pointer-events: none;
	}

	.pill {
		position: absolute;
		width: max-content;
	}
</style>
