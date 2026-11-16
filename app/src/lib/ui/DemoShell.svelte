<script lang="ts">
	/**
	 * The frame shared by every demo: the picture fills the screen; the title,
	 * a card of notes, a panel of controls and a dock of tools float over it.
	 * Keys: N notes, C controls, R reset the view, S save a still, F full
	 * screen, H hide everything but the picture.
	 */
	import type { Snippet } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import { resolve } from '$app/paths';
	import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/svelte';
	import {
		ArrowLeft02Icon,
		Atom02Icon,
		Camera01Icon,
		Cancel01Icon,
		HelpCircleIcon,
		InformationCircleIcon,
		FullScreenIcon,
		MinimizeScreenIcon,
		SlidersHorizontalIcon,
		Target02Icon,
		ViewIcon,
		ViewOffIcon
	} from '@hugeicons/core-free-icons';
	import { demos } from '../demos';

	interface Props {
		title: string;
		stage: Snippet;
		controls: Snippet;
		notes: Snippet;
		/** The physics behind the demo, with its equations: a second tab of the notes. */
		physics?: Snippet;
		/** Return the view to where it started. */
		onreset?: () => void;
		/** A still of the picture, to download. */
		onsave?: () => Promise<Blob | null>;
	}

	let { title, stage, controls, notes, physics, onreset, onsave }: Props = $props();

	const kicker = $derived(demos.find((d) => d.title === title)?.affordance);
	const fileName = $derived(title.toLowerCase().replace(/[^a-z0-9]+/g, '-'));

	let notesOpen = $state(true);
	let controlsOpen = $state(true);
	let helpOpen = $state(false);
	let bare = $state(false);
	let fullscreen = $state(false);
	let saving = $state(false);
	let tab: 'about' | 'physics' = $state('about');

	/**
	 * Let a card be dragged by its header. Its offset is remembered, kept on
	 * screen, and forgotten on a double-click. On phones the cards are sheets
	 * and stay put.
	 */
	function movable(key: string) {
		return (card: HTMLElement) => {
			if (narrow()) return;
			const head = card.querySelector<HTMLElement>('.card-head');
			if (!head) return;
			const storeKey = `gc-card-${key}`;
			let dx = 0;
			let dy = 0;
			try {
				[dx, dy] = JSON.parse(localStorage.getItem(storeKey) ?? '[0,0]');
			} catch {
				/* storage may be unavailable; start where the layout puts the card */
			}
			const apply = () => (card.style.translate = `${dx}px ${dy}px`);
			const keepOnScreen = () => {
				const r = card.getBoundingClientRect();
				const margin = 8;
				if (r.left < margin) dx += margin - r.left;
				if (r.top < margin) dy += margin - r.top;
				if (r.right > innerWidth - margin) dx -= r.right - (innerWidth - margin);
				if (r.top > innerHeight - 48) dy -= r.top - (innerHeight - 48);
				apply();
			};
			const save = () => {
				try {
					localStorage.setItem(storeKey, JSON.stringify([dx, dy]));
				} catch {
					/* not remembered, which is fine */
				}
			};
			let start: { x: number; y: number; dx: number; dy: number } | undefined;
			const down = (e: PointerEvent) => {
				if ((e.target as HTMLElement).closest('button')) return;
				start = { x: e.clientX, y: e.clientY, dx, dy };
				head.setPointerCapture(e.pointerId);
				card.classList.add('dragging');
			};
			const move = (e: PointerEvent) => {
				if (!start) return;
				dx = start.dx + e.clientX - start.x;
				dy = start.dy + e.clientY - start.y;
				apply();
			};
			const up = () => {
				if (!start) return;
				start = undefined;
				card.classList.remove('dragging');
				keepOnScreen();
				save();
			};
			const home = () => {
				dx = 0;
				dy = 0;
				apply();
				save();
			};
			apply();
			requestAnimationFrame(keepOnScreen);
			head.addEventListener('pointerdown', down);
			head.addEventListener('pointermove', move);
			head.addEventListener('pointerup', up);
			head.addEventListener('pointercancel', up);
			head.addEventListener('dblclick', home);
			return () => {
				head.removeEventListener('pointerdown', down);
				head.removeEventListener('pointermove', move);
				head.removeEventListener('pointerup', up);
				head.removeEventListener('pointercancel', up);
				head.removeEventListener('dblclick', home);
			};
		};
	}

	/** On a phone the cards would cover the picture: start with them put away. */
	function narrowStart() {
		if (window.matchMedia('(max-width: 720px)').matches) {
			notesOpen = false;
			controlsOpen = false;
		}
	}

	const narrow = () => window.matchMedia('(max-width: 720px)').matches;

	function toggleNotes() {
		notesOpen = !notesOpen;
		if (notesOpen && narrow()) controlsOpen = false;
	}

	function toggleControls() {
		controlsOpen = !controlsOpen;
		if (controlsOpen && narrow()) notesOpen = false;
	}

	async function toggleFullscreen() {
		if (document.fullscreenElement) await document.exitFullscreen();
		else await document.documentElement.requestFullscreen?.();
	}

	async function save() {
		if (!onsave || saving) return;
		saving = true;
		try {
			const blob = await onsave();
			if (!blob) return;
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `${fileName}.png`;
			a.click();
			setTimeout(() => URL.revokeObjectURL(url), 1000);
		} finally {
			saving = false;
		}
	}

	function onKey(e: KeyboardEvent) {
		if (e.metaKey || e.ctrlKey || e.altKey) return;
		const t = e.target as HTMLElement | null;
		if (t?.isContentEditable || t?.tagName === 'TEXTAREA') return;
		if (t instanceof HTMLInputElement && !['range', 'checkbox'].includes(t.type)) return;
		const key = e.key.toLowerCase();
		if (key === 'n') toggleNotes();
		else if (key === 'c') toggleControls();
		else if (key === 'r' && onreset) onreset();
		else if (key === 's' && onsave) save();
		else if (key === 'f') toggleFullscreen();
		else if (key === 'h') bare = !bare;
		else if (key === '?') helpOpen = !helpOpen;
		else if (key === 'escape') helpOpen = false;
		else return;
		e.preventDefault();
	}
</script>

<svelte:window onkeydown={onKey} />
<svelte:document onfullscreenchange={() => (fullscreen = !!document.fullscreenElement)} />

<main class={['always-dark', { bare }]} {@attach narrowStart}>
	<div class="stage">{@render stage()}</div>

	{#if !bare}
		<header transition:fade={{ duration: 150 }}>
			<a class="back" href={resolve('/demo')}>
				<HugeiconsIcon icon={ArrowLeft02Icon} size={16} strokeWidth={2} />
				<span>All demos</span>
			</a>
			<div class="titles">
				{#if kicker}<p class="kicker">{kicker}</p>{/if}
				<h1>{title}</h1>
			</div>
		</header>

		{#if notesOpen}
			<aside
				class="card notes"
				aria-label="About this demo"
				transition:fly={{ x: -16, duration: 180 }}
				{@attach movable('notes')}
			>
				<div class="card-head" title="Drag to move · double-click to put back">
					{#if physics}
						<div class="tabs" role="tablist" aria-label="Notes">
							<button
								type="button"
								role="tab"
								aria-selected={tab === 'about'}
								onclick={() => (tab = 'about')}
							>
								<HugeiconsIcon icon={InformationCircleIcon} size={15} strokeWidth={1.8} /> About
							</button>
							<button
								type="button"
								role="tab"
								aria-selected={tab === 'physics'}
								onclick={() => (tab = 'physics')}
							>
								<HugeiconsIcon icon={Atom02Icon} size={15} strokeWidth={1.8} /> Physics
							</button>
						</div>
					{:else}
						<span>
							<HugeiconsIcon icon={InformationCircleIcon} size={15} strokeWidth={1.8} /> About this demo
						</span>
					{/if}
					<button type="button" class="close" aria-label="Close the notes" onclick={toggleNotes}>
						<HugeiconsIcon icon={Cancel01Icon} size={15} strokeWidth={1.8} />
					</button>
				</div>
				<div class={['scroll', { physics: tab === 'physics' && physics }]} role="tabpanel">
					{#if tab === 'physics' && physics}{@render physics()}{:else}{@render notes()}{/if}
				</div>
			</aside>
		{/if}

		{#if controlsOpen}
			<section
				class="card inspector"
				aria-label="Controls"
				transition:fly={{ x: 16, duration: 180 }}
				{@attach movable('controls')}
			>
				<div class="card-head" title="Drag to move · double-click to put back">
					<span
						><HugeiconsIcon icon={SlidersHorizontalIcon} size={15} strokeWidth={1.8} /> Controls</span
					>
					<button
						type="button"
						class="close"
						aria-label="Close the controls"
						onclick={toggleControls}
					>
						<HugeiconsIcon icon={Cancel01Icon} size={15} strokeWidth={1.8} />
					</button>
				</div>
				<div class="scroll">{@render controls()}</div>
			</section>
		{/if}

		<nav class="dock" aria-label="Tools" transition:fly={{ y: 12, duration: 180 }}>
			{@render tool(InformationCircleIcon, 'Notes', 'N', toggleNotes, notesOpen)}
			{@render tool(SlidersHorizontalIcon, 'Controls', 'C', toggleControls, controlsOpen)}
			<span class="sep" aria-hidden="true"></span>
			{#if onreset}{@render tool(Target02Icon, 'Reset the view', 'R', onreset)}{/if}
			{#if onsave}{@render tool(Camera01Icon, 'Save a still', 'S', save)}{/if}
			{@render tool(
				fullscreen ? MinimizeScreenIcon : FullScreenIcon,
				fullscreen ? 'Leave full screen' : 'Full screen',
				'F',
				toggleFullscreen
			)}
			{@render tool(ViewOffIcon, 'Hide the interface', 'H', () => (bare = true))}
			{@render tool(HelpCircleIcon, 'How to use', '?', () => (helpOpen = !helpOpen), helpOpen)}
		</nav>

		{#if helpOpen}
			<div
				class="card help"
				role="dialog"
				aria-label="How to use"
				transition:fly={{ y: 8, duration: 150 }}
			>
				<div class="card-head">
					<span><HugeiconsIcon icon={HelpCircleIcon} size={15} strokeWidth={1.8} /> How to use</span
					>
					<button type="button" class="close" aria-label="Close" onclick={() => (helpOpen = false)}>
						<HugeiconsIcon icon={Cancel01Icon} size={15} strokeWidth={1.8} />
					</button>
				</div>
				<dl>
					<dt>Drag the picture</dt>
					<dd>look around</dd>
					<dt>Scroll</dt>
					<dd>zoom</dd>
					<dt>Drag the line</dt>
					<dd>move between light and gravity (arrow keys when it is selected)</dd>
					<dt><kbd>N</kbd> <kbd>C</kbd></dt>
					<dd>notes, controls</dd>
					<dt><kbd>R</kbd> <kbd>S</kbd></dt>
					<dd>reset the view, save a still</dd>
					<dt><kbd>F</kbd> <kbd>H</kbd></dt>
					<dd>full screen, hide everything but the picture</dd>
				</dl>
			</div>
		{/if}
	{:else}
		<button
			type="button"
			class="unhide"
			onclick={() => (bare = false)}
			transition:fade={{ duration: 150 }}
		>
			<HugeiconsIcon icon={ViewIcon} size={15} strokeWidth={1.8} /> Show the interface <kbd>H</kbd>
		</button>
	{/if}
</main>

{#snippet tool(
	icon: IconSvgElement,
	label: string,
	key: string,
	onclick: () => void,
	pressed: boolean | undefined = undefined
)}
	<button type="button" class="tool" aria-label={label} aria-pressed={pressed} {onclick}>
		<HugeiconsIcon {icon} size={19} strokeWidth={1.6} />
		<span class="tip" aria-hidden="true">{label} <kbd>{key}</kbd></span>
	</button>
{/snippet}

<style>
	main {
		position: fixed;
		inset: 0;
		background: #000;
		color: var(--text);
		font-family: var(--font-sans);
		--glass: rgb(12 15 21 / 0.84);
		--glass-line: rgb(255 255 255 / 0.08);
	}

	.stage {
		position: absolute;
		inset: 0;
	}

	/* --- title ------------------------------------------------------------------ */

	header {
		position: absolute;
		top: 1rem;
		left: 1rem;
		display: flex;
		align-items: center;
		gap: 0.8rem;
		max-width: calc(100% - 2rem);
		padding: 0.45rem 1.1rem 0.5rem 0.45rem;
		border-radius: 14px;
		background: var(--glass);
		border: 1px solid var(--glass-line);
		backdrop-filter: blur(18px);
		box-shadow: 0 10px 30px rgb(0 0 0 / 0.35);
	}

	.back {
		flex: none;
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		height: 2.2rem;
		padding: 0 0.85rem 0 0.7rem;
		border-radius: 10px;
		background: #f1ede4;
		color: #15171c;
		font: 500 0.78rem/1 var(--font-sans);
		text-decoration: none;
		box-shadow: 0 1px 6px rgb(0 0 0 / 0.3);
		transition:
			background-color 0.15s,
			translate 0.15s;
	}

	.back:hover {
		background: #fff;
		translate: -1px 0;
	}

	.back:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.titles {
		min-width: 0;
	}

	.kicker {
		margin: 0 0 0.25rem;
		font: 600 0.6rem/1 var(--font-sans);
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--accent);
	}

	h1 {
		margin: 0;
		font: 400 clamp(1.15rem, 2vw, 1.45rem) / 1.1 var(--font-serif);
		letter-spacing: -0.005em;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* --- floating cards ---------------------------------------------------------- */

	.card {
		position: absolute;
		display: flex;
		flex-direction: column;
		background: var(--glass);
		border: 1px solid var(--glass-line);
		border-radius: 16px;
		backdrop-filter: blur(18px) saturate(1.3);
		box-shadow: 0 14px 44px rgb(0 0 0 / 0.42);
		overflow: hidden;
	}

	.card-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.7rem 0.6rem 0.55rem 1rem;
		border-bottom: 1px solid var(--glass-line);
		font: 600 0.66rem/1 var(--font-sans);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--text-dim);
	}

	.card-head span {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
	}

	.card-head {
		cursor: grab;
		touch-action: none;
		user-select: none;
	}

	:global(.dragging) .card-head {
		cursor: grabbing;
	}

	.card:global(.dragging) {
		box-shadow: 0 20px 60px rgb(0 0 0 / 0.55);
	}

	.tabs {
		display: flex;
		gap: 0.2rem;
		margin-left: -0.45rem;
	}

	.tabs button {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.4rem 0.6rem;
		border: 0;
		border-radius: 8px;
		background: transparent;
		color: var(--text-faint);
		font: inherit;
		letter-spacing: inherit;
		text-transform: inherit;
		cursor: pointer;
	}

	.tabs button:hover {
		color: var(--text-dim);
	}

	.tabs button[aria-selected='true'] {
		background: rgb(255 255 255 / 0.08);
		color: var(--text);
	}

	.tabs button[aria-selected='true'] :global(svg) {
		color: var(--accent);
	}

	.close {
		display: grid;
		place-items: center;
		width: 1.7rem;
		height: 1.7rem;
		border: 0;
		border-radius: 8px;
		background: transparent;
		color: var(--text-faint);
		cursor: pointer;
	}

	.close:hover {
		background: rgb(255 255 255 / 0.08);
		color: var(--text);
	}

	.scroll {
		overflow-y: auto;
		overscroll-behavior: contain;
		padding: 0.9rem 1rem 1rem;
		scrollbar-width: thin;
		scrollbar-color: rgb(255 255 255 / 0.18) transparent;
	}

	.notes {
		left: 1rem;
		top: 5.4rem;
		width: min(23.5rem, calc(100% - 2rem));
		max-height: calc(100% - 5.4rem - 5.4rem);
		font-size: 0.84rem;
		line-height: 1.55;
	}

	.notes :global(p) {
		margin: 0 0 0.8rem;
		text-wrap: pretty;
	}

	.notes :global(strong) {
		color: #fff;
		font-weight: 600;
	}

	.notes :global(dl) {
		margin: 0.9rem 0;
		display: grid;
		gap: 0.55rem;
		padding: 0.75rem 0.8rem;
		border-radius: 10px;
		background: rgb(255 255 255 / 0.04);
	}

	.notes :global(dt) {
		color: var(--text-faint);
		font-size: 0.7rem;
	}

	.notes :global(dd) {
		margin: 0.1rem 0 0;
		font-family: var(--font-mono);
		font-size: 0.76rem;
		color: var(--text);
	}

	.notes :global(.fine) {
		color: var(--text-faint);
		font-size: 0.74rem;
		margin: 0;
	}

	.notes :global(.fine + .fine) {
		margin-top: 0.6rem;
	}

	/* the physics tab: set like the paper, for reading */
	.scroll.physics {
		font: 400 0.95rem/1.6 var(--font-serif);
		color: #e6e2d9;
	}

	.scroll.physics :global(h4) {
		margin: 1.1rem 0 0.35rem;
		font: 600 0.62rem/1 var(--font-sans);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--accent);
	}

	.scroll.physics :global(h4:first-child) {
		margin-top: 0.1rem;
	}

	.scroll.physics :global(p) {
		margin: 0 0 0.7rem;
	}

	.scroll.physics :global(.numbers) {
		margin: 0.9rem 0 0;
		font-family: var(--font-sans);
	}

	.inspector {
		right: 1rem;
		top: 4rem;
		width: min(19rem, calc(100% - 2rem));
		max-height: calc(100% - 4rem - 5.4rem);
	}

	/* --- dock --------------------------------------------------------------------- */

	.dock {
		position: absolute;
		left: 50%;
		bottom: 1rem;
		translate: -50% 0;
		display: flex;
		align-items: center;
		gap: 0.15rem;
		padding: 0.3rem;
		border-radius: 14px;
		background: var(--glass);
		border: 1px solid var(--glass-line);
		backdrop-filter: blur(18px);
		box-shadow: 0 10px 30px rgb(0 0 0 / 0.4);
	}

	.sep {
		width: 1px;
		height: 1.4rem;
		margin: 0 0.25rem;
		background: var(--glass-line);
	}

	.tool {
		position: relative;
		display: grid;
		place-items: center;
		width: 2.4rem;
		height: 2.4rem;
		border: 0;
		border-radius: 10px;
		background: transparent;
		color: var(--text-dim);
		cursor: pointer;
		transition:
			background-color 0.15s,
			color 0.15s;
	}

	.tool:hover,
	.tool:focus-visible {
		background: rgb(255 255 255 / 0.08);
		color: var(--text);
		outline: none;
	}

	.tool[aria-pressed='true'] {
		color: var(--accent);
	}

	.tip {
		position: absolute;
		bottom: calc(100% + 10px);
		left: 50%;
		translate: -50% 4px;
		padding: 0.4rem 0.55rem;
		border-radius: 8px;
		background: rgb(20 23 30 / 0.96);
		border: 1px solid var(--glass-line);
		color: var(--text);
		font-size: 0.72rem;
		white-space: nowrap;
		opacity: 0;
		pointer-events: none;
		transition:
			opacity 0.12s,
			translate 0.12s;
	}

	.tool:hover .tip,
	.tool:focus-visible .tip {
		opacity: 1;
		translate: -50% 0;
	}

	kbd {
		display: inline-block;
		min-width: 1.3em;
		padding: 0.05em 0.35em;
		border-radius: 4px;
		border: 1px solid rgb(255 255 255 / 0.18);
		font: 500 0.66rem/1.4 var(--font-mono);
		color: var(--text-dim);
		text-align: center;
	}

	.help {
		left: 50%;
		bottom: 4.6rem;
		translate: -50% 0;
		width: min(24rem, calc(100% - 2rem));
	}

	.help dl {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.55rem 1rem;
		margin: 0;
		padding: 0.9rem 1rem 1rem;
		font-size: 0.8rem;
	}

	.help dt {
		color: var(--text);
		white-space: nowrap;
	}

	.help dd {
		margin: 0;
		color: var(--text-dim);
	}

	.unhide {
		position: absolute;
		left: 50%;
		bottom: 1rem;
		translate: -50% 0;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.8rem;
		border-radius: 999px;
		border: 1px solid var(--glass-line);
		background: rgb(12 15 21 / 0.5);
		color: var(--text-dim);
		font-size: 0.74rem;
		cursor: pointer;
		opacity: 0.5;
		transition: opacity 0.2s;
	}

	.unhide:hover {
		opacity: 1;
	}

	/* --- phones: the cards become sheets over the lower part of the screen --------- */

	@media (max-width: 720px) {
		header {
			top: 0.6rem;
			left: 0.6rem;
		}

		h1 {
			font-size: 1.2rem;
		}

		.notes,
		.inspector {
			left: 0.5rem;
			right: 0.5rem;
			top: auto;
			bottom: 4.4rem;
			width: auto;
			max-height: 52svh;
		}

		.dock {
			bottom: 0.6rem;
		}

		.tool {
			width: 2.3rem;
			height: 2.3rem;
		}

		.tip {
			display: none;
		}
	}
</style>
